// Define common log levels with their colors
export const LOG_LEVELS = {
  trace: { color: '#6c757d', backgroundColor: '#f8f9fa' },
  debug: { color: '#0dcaf0', backgroundColor: '#e8f7fa' },
  info: { color: '#0d6efd', backgroundColor: '#e6f2ff' },
  warn: { color: '#ffc107', backgroundColor: '#fff8e6' },
  warning: { color: '#ffc107', backgroundColor: '#fff8e6' },
  error: { color: '#dc3545', backgroundColor: '#f8e7e9' },
  fatal: { color: '#fff', backgroundColor: '#6f42c1' }
};

// Parse stream metrics from message
export const parseStreamMetrics = (message) => {
  if (!message) return null;
  
  try {
    const fpsMatch = message.match(/FPS: ([\d.]+)/);
    const frameSkipMatch = message.match(/Frame skip: ([\d.]+)/);
    const efficiencyMatch = message.match(/Efficiency: ([\d.]+)/);
    const streamMatch = message.match(/Stream ([\w-]+)/);
    
    if (!fpsMatch || !frameSkipMatch || !efficiencyMatch || !streamMatch) {
      return null;
    }
    
    return {
      fps: parseFloat(fpsMatch[1]),
      frameSkip: parseInt(frameSkipMatch[1]),
      efficiency: parseFloat(efficiencyMatch[1]),
      streamId: streamMatch[1]
    };
  } catch (err) {
    return null;
  }
};

// Format JSON for display
export const formatJson = (json) => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (err) {
    return String(json);
  }
};

// Parse incident log messages
export const parseIncidentLog = (log) => {
  if (!log || !log.message) return null;

  try {
    // Skipping incident due to cooldown
    const skipMatch = log.message.match(/Skipping incident due to cooldown - Source: ([a-zA-Z0-9_-]+), Incident: ([a-zA-Z0-9_-]+)/);
    if (skipMatch) {
      return {
        type: 'skip',
        stream: skipMatch[1],
        incidentType: skipMatch[2],
        timestamp: log.timestamp
      };
    }

    // Sending incident
    if (log.message.includes('Sending incident:')) {
      try {
        const incidentDataStr = log.message.replace('Sending incident:', '').trim();
        // Extract JSON-like content enclosed in curly braces
        const incidentMatch = incidentDataStr.match(/{([^}]+)}/);
        
        if (incidentMatch) {
          // Convert the matched string to a proper JSON format
          const jsonStr = incidentMatch[0].replace(/'/g, '"');
          
          // Parse the JSON
          const incidentData = JSON.parse(jsonStr);
          
          // Extract stream and violation from Description
          const descMatch = incidentData.Description?.match(/Stream ([a-zA-Z0-9_-]+): ([^']+)/);
          
          return {
            type: 'send',
            locationKey: incidentData.LocationKey,
            incidentDateTime: incidentData.IncidentDateTime,
            incidentTypeKey: incidentData.IncidentTypeKey,
            severityKey: incidentData.SeverityKey,
            stream: descMatch ? descMatch[1] : 'unknown',
            violation: descMatch ? descMatch[2] : incidentData.Description,
            timestamp: log.timestamp
          };
        }
      } catch (e) {
        console.error('Error parsing incident data:', e);
      }
    }

    // API Response for incident creation
    const apiResponseMatch = log.message.match(/API Response: (\d+) - (\{.+})/);
    if (apiResponseMatch) {
      try {
        const status = apiResponseMatch[1];
        const responseData = JSON.parse(apiResponseMatch[2]);
        
        return {
          type: 'api_response',
          status: parseInt(status),
          incidentKey: responseData.IncidentKey,
          message: responseData.Status,
          timestamp: log.timestamp
        };
      } catch (e) {
        console.error('Error parsing API response:', e);
      }
    }

    // Incident report sent successfully
    const reportSentMatch = log.message.match(/Incident report sent successfully: (\d+)/);
    if (reportSentMatch) {
      return {
        type: 'report_sent',
        status: parseInt(reportSentMatch[1]),
        timestamp: log.timestamp
      };
    }

    // Uploading image attachment
    const uploadImageMatch = log.message.match(/Uploading image attachment for incident (\d+)/);
    if (uploadImageMatch) {
      return {
        type: 'upload_image',
        incidentKey: parseInt(uploadImageMatch[1]),
        timestamp: log.timestamp
      };
    }

    // Attachment API Response
    const attachmentResponseMatch = log.message.match(/Attachment API Response: (\d+) - (\[.+\])/);
    if (attachmentResponseMatch) {
      try {
        const status = attachmentResponseMatch[1];
        const attachmentIds = JSON.parse(attachmentResponseMatch[2]);
        
        return {
          type: 'attachment_response',
          status: parseInt(status),
          attachmentIds: attachmentIds,
          timestamp: log.timestamp
        };
      } catch (e) {
        console.error('Error parsing attachment response:', e);
      }
    }

    return null;
  } catch (err) {
    console.error('Error parsing incident log:', err);
    return null;
  }
};

// Helper to get severity label
export const getSeverityLabel = (key) => {
  const severityMap = {
    0: 'Unknown',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical'
  };
  return severityMap[key] || `Severity ${key}`;
};

export default {
  LOG_LEVELS,
  parseStreamMetrics,
  formatJson,
  parseIncidentLog,
  getSeverityLabel
}; 