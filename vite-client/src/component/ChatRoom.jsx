import React, { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";

var stompClient = null;
const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    userName: "",
    receiverName: "",
    connected: false,
    message: "",
  });

  const handleValue = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const sendPublicMessage = () => {
    if (stompClient) {
      let chatMessage = {
        senderName: userData.userName,
        message: userData.message,
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateMessage = () => {
    if (stompClient) {
      let chatMessage = {
        senderName: userData.userName,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };
      if (userData.userName !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      console.log(chatMessage);
      console.log(privateChats);
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const registerUser = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onPublicMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.userName + "/private",
      onPrivateMessageReceived
    );
    userJoin();
  };

  const userJoin = () => {
    if (stompClient) {
      let chatMessage = {
        senderName: userData.userName,
        status: "JOIN",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }
  };

  const onPublicMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessageReceived = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <>
      {userData.connected ? (
        <div className="">
          <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
            <div class="font-semibold text-2xl">ChitiChat</div>
            <div class="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-between">
              User
            </div>
          </div>
          <div className="flex flex-row justify-between bg-white">
            <div class="flex-col w-2/5 justify-evenly border-r-2">
              <div class="border-b-2 py-7 px-2">
                <input
                  type="text"
                  placeholder="search chatting"
                  class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                />
              </div>
              <ul>
                <div
                  class="flex flex-row py-4 px-2 justify-start items-center border-b-2 bg-purple-500 text-lg font-semibold">
                  <li
                    onClick={() => {
                      setTab("CHATROOM");
                    }}
                    className={`member ${tab === "CHATROOM" && "active"}`}
                  >
                    Chatroom
                  </li>
                </div>
                {[...privateChats.keys()].map((name, index) => (
                  <li
                    onClick={() => {
                      setTab(name);
                    }}
                    className="flex flex-row py-4 px-2 justify-start items-center border-b-2 text-lg font-semibold"
                    key={index}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            {tab === "CHATROOM" && (
              <div className="w-full px-3 mt-3 flex flex-col justify-between">
                <ul className="flex-col">
                  {publicChats.map((chat, index) => (
                    <li className="message" key={index}>
                      <div className="flex justify-start mb-4">
                        {chat.senderName !== userData.userName && (
                          <>
                            <div className="ml-2 py-3 pl-4 pr-12 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white text-2xl">
                              <div className="text-yellow-950 font-semibold text-xs">
                                {chat.senderName}
                              </div>
                              {chat.message}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-end mb-4">
                        {chat.senderName === userData.userName && (
                          <>
                            <div className="ml-2 py-3 pr-4 pl-12 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white text-2xl">
                              <div className="flex justify-end text-yellow-950 font-semibold text-xs">
                                {chat.senderName}
                              </div>
                              {chat.message}
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg p-4 border gap-2 border-gray-300 shadow flex">
                  <input
                    type="text"
                    className="rounded-lg border-2 flex-1 border-gray-300 focus:outline-none hover:border-gray-400 px-4 py-2"
                    name="message"
                    placeholder="enter public message"
                    value={userData.message}
                    onChange={handleValue}
                  />
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white active:bg-cyan-400"
                    onClick={sendPublicMessage}
                  >
                    send
                  </button>
                </div>
              </div>
            )}
            {tab !== "CHATROOM" && (
              <div className="w-full px-3 mt-3 flex flex-col justify-between">
                <ul className="flex-col">
                  {[...privateChats.get(tab)].map((chat, index) => (
                    <li className="message" key={index}>
                      <div className="flex justify-start mb-4">
                        {chat.senderName !== userData.userName && (
                          <>
                            <div className="ml-2 py-3 pl-4 pr-12 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white text-2xl">
                              <div className="text-yellow-950 font-semibold text-xs">
                                {chat.senderName}
                              </div>
                              {chat.message}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-end mb-4">
                        {chat.senderName === userData.userName && (
                          <>
                            <div className="ml-2 py-3 pr-4 pl-12 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white text-2xl">
                              <div className="flex justify-end text-yellow-950 font-semibold text-xs">
                                {chat.senderName}
                              </div>
                              {chat.message}
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg p-4 border gap-2 border-gray-300 shadow flex">
                  <input
                    type="text"
                    className="rounded-lg border-2 flex-1 border-gray-300 focus:outline-none hover:border-gray-400 px-4 py-2"
                    name="message"
                    placeholder={`enter private message for ${tab}`}
                    value={userData.message}
                    onChange={handleValue}
                  />
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white active:bg-cyan-400"
                    onClick={sendPrivateMessage}
                  >
                    send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-sm my-10">
          <div className="rounded-lg p-4 border gap-2 border-gray-300 shadow flex">
            <input name="userName"
              className="rounded-lg border-2 flex-1 border-gray-300 focus:outline-none hover:border-gray-400 px-4 py-2"
              placeholder="Enter the user name"
              value={userData.userName}
              onChange={handleValue}
            />
            <button className="rounded-lg px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white active:bg-cyan-400" onClick={registerUser}>
              Connect
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
