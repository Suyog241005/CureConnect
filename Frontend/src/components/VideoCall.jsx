import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Function to generate a random ID
function randomID(len) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Function to get URL parameters
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function VideoCall() {
  const roomID = getUrlParams().get('roomID') || randomID(5);

  let myMeeting = async (element) => {
    // ZegoCloud credentials
    const appID = 42129068;
    const serverSecret = "63aaa5d4225aff1bb35ec9e92c20a0c8";
    
    // Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomID,  
      randomID(5),  
      randomID(5)
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Get local IP address
    const localIP = "192.168.20.18"; // Replace with your actual local IP

    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol + '//' + 
            localIP + ':' + window.location.port + window.location.pathname +
            '?roomID=' + roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // Use OneONoneCall for 1-on-1 calls
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}