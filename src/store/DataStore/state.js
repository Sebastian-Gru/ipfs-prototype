export default function () {
  return {
    userList: [
      {
        id: 1,
        name: "Global",
        online: true,
      },
      {
        id: 2,
        name: "Mia",
        online: false,
      },
      {
        id: 3,
        name: "Paul",
        online: false,
      },
    ],
    allMessages: {
      global: [
        {
          from: "IPFS - Chat",
          data: "Hello User, write a message to everyone!",
        },
      ],
    },
    allFiles: {
      global: [
        {
          from: "Can not be downloaded!",
          hash:
            "https://swapfiets.de/assets/Uploads/deluxe7-eclipseblack-1.jpg",
          name: "Testfile.jpg",
          date: "XXX",
        },
      ],
    },
    peers: [],
    IPFSInstance: null,
    myID: "",
    myName: "",
    currentMsg: "",
    selectedPeer: "global",
    swarmAdresses: null,
    pingArray: [],
  };
}
