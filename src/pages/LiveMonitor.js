// // import React, { useState, useEffect } from 'react';
// // import styled, { createGlobalStyle } from 'styled-components';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import VideoFeed from './VideoFeed';  // Import the VideoFeed component

// // const GlobalStyle = createGlobalStyle`
// //   body {
// //     margin: 0;
// //     padding: 0;
// //     font-family: 'Arial', sans-serif;
// //     background: #0f0f1f;
// //     color: #ffffff;
// //   }
// // `;

// // const Container = styled(motion.div)`
// //   min-height: 100vh;
// //   display: flex;
// //   flex-direction: column;
// //   align-items: center;
// //   padding: 2rem;
// // `;

// // const Title = styled(motion.h1)`
// //   font-size: 3rem;
// //   margin-bottom: 2rem;
// //   text-align: center;
// //   background: linear-gradient(45deg, #00ffff, #ff00ff);
// //   -webkit-background-clip: text;
// //   -webkit-text-fill-color: transparent;
// //   text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
// // `;

// // const VideoCardContainer = styled(motion.div)`
// //   display: flex;
// //   flex-wrap: wrap;
// //   justify-content: center;
// //   gap: 2rem;
// // `;

// // const VideoCard = styled(motion.div)`
// //   background: rgba(255, 255, 255, 0.1);
// //   border-radius: 20px;
// //   padding: 1rem;
// //   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
// //   backdrop-filter: blur(4px);
// //   border: 1px solid rgba(255, 255, 255, 0.18);
// //   width: 400px; /* Set desired width */
// //   height: 350px; /* Set desired height */
// //   overflow: hidden;
// // `;

// // const StatusIndicator = styled(motion.div)`
// //   width: 10px;
// //   height: 10px;
// //   border-radius: 50%;
// //   background-color: ${props => props.active ? '#00ff00' : '#ff0000'};
// //   margin-right: 0.5rem;
// // `;

// // const StatusBar = styled(motion.div)`
// //   display: flex;
// //   align-items: center;
// //   margin-bottom: 0.5rem;
// // `;

// // const Button = styled(motion.button)`
// //   background: linear-gradient(45deg, #00ffff, #ff00ff);
// //   border: none;
// //   color: white;
// //   padding: 0.5rem 1rem;
// //   font-size: 1rem;
// //   border-radius: 5px;
// //   cursor: pointer;
// //   margin-top: 1rem;

// //   &:hover {
// //     opacity: 0.8;
// //   }
// // `;

// // const serverUrls = ['http://localhost:5007', 'http://localhost:5008'];

// // const LiveMonitor = () => {
// //   const [isActive, setIsActive] = useState(true);
// //   const [streams, setStreams] = useState([]);

// //   useEffect(() => {
// //     const fetchStreams = () => {
// //       const requests = serverUrls.map(serverUrl =>
// //         fetch(`${serverUrl}/api/streams`)
// //           .then(response => response.json())
// //           .then(data => {
// //             // Map each streamId to its server URL
// //             return data.map(streamId => ({ streamId, serverUrl }));
// //           })
// //           .catch(error => {
// //             console.error(`Error fetching stream IDs from ${serverUrl}:`, error);
// //             return [];
// //           })
// //       );

// //       Promise.all(requests).then(results => {
// //         const allStreams = results.flat();
// //         setStreams(allStreams);
// //       });
// //     };

// //     fetchStreams();
// //     const interval = setInterval(fetchStreams, 5000);

// //     return () => clearInterval(interval);
// //   }, [serverUrls]);

// //   return (
// //     <>
// //       <GlobalStyle />
// //       <Container
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         transition={{ duration: 0.5 }}
// //       >
// //         <Title
// //           initial={{ y: -50 }}
// //           animate={{ y: 0 }}
// //           transition={{ type: 'spring', stiffness: 100 }}
// //         >
// //           Live Monitor
// //         </Title>
// //         <VideoCardContainer>
// //           {streams.length > 0 ? (
// //             streams.map(({ streamId, serverUrl }) => (
// //               <VideoCard
// //                 key={`${serverUrl}-${streamId}`}
// //                 initial={{ scale: 0.9 }}
// //                 animate={{ scale: 1 }}
// //                 transition={{ type: 'spring', stiffness: 100 }}
// //               >
// //                 <StatusBar>
// //                   <StatusIndicator
// //                     active={isActive}
// //                     initial={{ scale: 0 }}
// //                     animate={{ scale: 1 }}
// //                     transition={{ type: 'spring', stiffness: 200 }}
// //                   />
// //                   <span>{isActive ? 'Active' : 'Inactive'}</span>
// //                 </StatusBar>
// //                 <AnimatePresence>
// //                   {isActive && (
// //                     <motion.div
// //                       initial={{ opacity: 0 }}
// //                       animate={{ opacity: 1 }}
// //                       exit={{ opacity: 0 }}
// //                     >
// //                       <VideoFeed serverUrl={serverUrl} streamId={streamId} />
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //                 <Button
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                   onClick={() => setIsActive(!isActive)}
// //                 >
// //                   {isActive ? 'Deactivate' : 'Activate'}
// //                 </Button>
// //               </VideoCard>
// //             ))
// //           ) : (
// //             <p>No streams available.</p>
// //           )}
// //         </VideoCardContainer>
// //       </Container>
// //     </>
// //   );
// // };

// // export default LiveMonitor;
// import React, { useState, useEffect } from 'react';
// import styled, { createGlobalStyle } from 'styled-components';
// import { motion, AnimatePresence } from 'framer-motion';
// import VideoFeed from './VideoFeed';  // Import the VideoFeed component

// const GlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     padding: 0;
//     font-family: 'Arial', sans-serif;
//     background: #0f0f1f;
//     color: #ffffff;
//   }
// `;

// const Container = styled(motion.div)`
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 2rem;
// `;

// const Title = styled(motion.h1)`
//   font-size: 3rem;
//   margin-bottom: 2rem;
//   text-align: center;
//   background: linear-gradient(45deg, #00ffff, #ff00ff);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
// `;

// const CatalogContainer = styled(motion.div)`
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
//   width: 100%;
//   max-width: 800px;
// `;

// const ServerSection = styled(motion.div)`
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 20px;
//   padding: 1rem;
//   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//   backdrop-filter: blur(4px);
//   border: 1px solid rgba(255, 255, 255, 0.18);
// `;

// const ServerTitle = styled.h2`
//   font-size: 1.5rem;
//   margin-bottom: 1rem;
// `;

// const StreamList = styled.ul`
//   list-style-type: none;
//   padding: 0;
// `;

// const StreamItem = styled.li`
//   margin-bottom: 0.5rem;
// `;

// const Button = styled(motion.button)`
//   background: linear-gradient(45deg, #00ffff, #ff00ff);
//   border: none;
//   color: white;
//   padding: 0.5rem 1rem;
//   font-size: 1rem;
//   border-radius: 5px;
//   cursor: pointer;
//   margin-top: 1rem;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const VideoGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//   gap: 1rem;
//   width: 100%;
//   max-width: 1200px;
//   margin-top: 2rem;
// `;

// const VideoCard = styled(motion.div)`
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 20px;
//   padding: 1rem;
//   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//   backdrop-filter: blur(4px);
//   border: 1px solid rgba(255, 255, 255, 0.18);
//   overflow: hidden;
// `;

// const serverUrls = [
//   { url: 'http://localhost:5007', name: 'Server1' },
//   { url: 'http://localhost:5008', name: 'Server2' }
// ];

// const LiveMonitor = () => {
//   const [streams, setStreams] = useState({});
//   const [selectedStreams, setSelectedStreams] = useState([]);

//   useEffect(() => {
//     const fetchStreams = () => {
//       const requests = serverUrls.map(server =>
//         fetch(`${server.url}/api/streams`)
//           .then(response => response.json())
//           .then(data => ({ serverUrl: server.url, serverName: server.name, streams: data }))
//           .catch(error => {
//             console.error(`Error fetching stream IDs from ${server.url}:`, error);
//             return { serverUrl: server.url, serverName: server.name, streams: [] };
//           })
//       );

//       Promise.all(requests).then(results => {
//         const streamsByServer = {};
//         results.forEach(({ serverUrl, serverName, streams }) => {
//           if (streams.length > 0) {
//             streamsByServer[serverUrl] = { name: serverName, streams };
//           }
//         });
//         setStreams(streamsByServer);
//       });
//     };

//     fetchStreams();
//     const interval = setInterval(fetchStreams, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleStreamToggle = (serverUrl, streamId) => {
//     setSelectedStreams(prevSelected => {
//       const existingIndex = prevSelected.findIndex(
//         s => s.serverUrl === serverUrl && s.streamId === streamId
//       );
//       if (existingIndex >= 0) {
//         return prevSelected.filter((_, index) => index !== existingIndex);
//       } else {
//         return [...prevSelected, { serverUrl, streamId }];
//       }
//     });
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <Container
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Title
//           initial={{ y: -50 }}
//           animate={{ y: 0 }}
//           transition={{ type: 'spring', stiffness: 100 }}
//         >
//           Live Monitor
//         </Title>
//         <CatalogContainer>
//           {Object.entries(streams).map(([serverUrl, { name, streams: streamIds }]) => (
//             <ServerSection
//               key={serverUrl}
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               transition={{ type: 'spring', stiffness: 100 }}
//             >
//               <ServerTitle>{name}</ServerTitle>
//               <StreamList>
//                 {streamIds.map(streamId => (
//                   <StreamItem key={streamId}>
//                     <Button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleStreamToggle(serverUrl, streamId)}
//                     >
//                       {selectedStreams.some(s => s.serverUrl === serverUrl && s.streamId === streamId)
//                         ? `Remove Stream ${streamId}`
//                         : `Add Stream ${streamId}`}
//                     </Button>
//                   </StreamItem>
//                 ))}
//               </StreamList>
//             </ServerSection>
//           ))}
//         </CatalogContainer>
//         <VideoGrid>
//           {selectedStreams.map(({ serverUrl, streamId }) => (
//             <VideoCard
//               key={`${serverUrl}-${streamId}`}
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               transition={{ type: 'spring', stiffness: 100 }}
//             >
//               <AnimatePresence>
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <VideoFeed serverUrl={serverUrl} streamId={streamId} />
//                 </motion.div>
//               </AnimatePresence>
//               <Button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleStreamToggle(serverUrl, streamId)}
//               >
//                 Remove Stream
//               </Button>
//             </VideoCard>
//           ))}
//         </VideoGrid>
//       </Container>
//     </>
//   );
// };

// export default LiveMonitor;
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoFeed from './VideoFeed';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
  }
`;

const Container = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
`;

const CatalogContainer = styled(motion.div)`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
`;

const ServerBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
  }
`;

const ServerTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  color: #00ffff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
`;

const StreamCount = styled.p`
  font-size: 1.2rem;
  color: #ff00ff;
  margin-top: 1rem;
`;

const StreamList = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;

const StreamItem = styled.div`
  margin-bottom: 1rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 3rem;
`;

const VideoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LiveIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  animation: ${pulseAnimation} 1.5s infinite;
`;

const serverUrls = [
  { url: 'http://localhost:5007', name: 'Server 1' },
  { url: 'http://localhost:5008', name: 'Server 2' }
];

export default function LiveMonitor() {
  const [streams, setStreams] = useState({});
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    const fetchStreams = () => {
      const requests = serverUrls.map(server =>
        fetch(`${server.url}/api/streams`)
          .then(response => response.json())
          .then(data => ({ serverUrl: server.url, serverName: server.name, streams: data }))
          .catch(error => {
            console.error(`Error fetching stream IDs from ${server.url}:`, error);
            return { serverUrl: server.url, serverName: server.name, streams: [] };
          })
      );

      Promise.all(requests).then(results => {
        const streamsByServer = {};
        results.forEach(({ serverUrl, serverName, streams }) => {
          if (streams.length > 0) {
            streamsByServer[serverUrl] = { name: serverName, streams };
          }
        });
        setStreams(streamsByServer);
      });
    };

    fetchStreams();
    const interval = setInterval(fetchStreams, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStreamToggle = (serverUrl, streamId) => {
    setSelectedStreams(prevSelected => {
      const existingIndex = prevSelected.findIndex(
        s => s.serverUrl === serverUrl && s.streamId === streamId
      );
      if (existingIndex >= 0) {
        return prevSelected.filter((_, index) => index !== existingIndex);
      } else {
        return [...prevSelected, { serverUrl, streamId }];
      }
    });
  };

  const handleServerClick = (serverUrl) => {
    setSelectedServer(serverUrl === selectedServer ? null : serverUrl);
  };

  return (
    <>
      <GlobalStyle />
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          Live Monitor
        </Title>
        <CatalogContainer>
          {Object.entries(streams).map(([serverUrl, { name, streams: streamIds }]) => (
            <ServerBox
              key={serverUrl}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              onClick={() => handleServerClick(serverUrl)}
            >
              <ServerTitle>{name}</ServerTitle>
              <StreamCount>{streamIds.length} Streams</StreamCount>
            </ServerBox>
          ))}
        </CatalogContainer>
        <AnimatePresence>
          {selectedServer && (
            <StreamList
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{streams[selectedServer].name} Streams</h3>
              {streams[selectedServer].streams.map(streamId => (
                <StreamItem key={streamId}>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStreamToggle(selectedServer, streamId)}
                  >
                    {selectedStreams.some(s => s.serverUrl === selectedServer && s.streamId === streamId)
                      ? `Remove Stream ${streamId}`
                      : `Add Stream ${streamId}`}
                  </Button>
                </StreamItem>
              ))}
            </StreamList>
          )}
        </AnimatePresence>
        <VideoGrid>
          <AnimatePresence>
            {selectedStreams.map(({ serverUrl, streamId }) => (
              <VideoCard
                key={`${serverUrl}-${streamId}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <div style={{ position: 'relative' }}>
                  <LiveIndicator />
                  <VideoFeed serverUrl={serverUrl} streamId={streamId} />
                </div>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStreamToggle(serverUrl, streamId)}
                  style={{ marginTop: '1rem' }}
                >
                  Remove Stream
                </Button>
              </VideoCard>
            ))}
          </AnimatePresence>
        </VideoGrid>
      </Container>
    </>
  );
}