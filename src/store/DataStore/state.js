export default function () {
  return {
    userList: [ {
      id: 1,
      name: 'Global',
      online:true
    }, {
      id: 2,
      name: 'Mia',
      online: false
    }, {
      id: 3,
      name: 'Paul',
      online:false
    }],
    allMessages: {
      'global': [
        {
          from: 'xyz',
          data: 'Hello!!!'
        }
      ]
    },
    peers: [{
      nodeid: "Global",
      name:"GlobalName",
      online: true
    }
    ],
    IPFSChatInstance: null,
    myID: "",
    myName: "",
    currentMsg: '',
    selectedPeer: 'global',

  }
}
