'use client'
import { useState, useEffect, useRef } from 'react';
import { Communicator } from "@/global/communicator";
import type { MetaMessage } from "@/types";

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MetaMessage[]>([]);
  const observerTarget = useRef(null);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const newMessage: MetaMessage = {
      userName: name,
      message,
      date: new Date().getTime()
    };
    Communicator.send(newMessage);
    // setMessages(prev => [...prev, newMessage]);
    // Clear inputs after sending
    // setName('');
    setMessage('');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Communicator.requestData(messages.length);
          }
        });
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
      Communicator.setMessages = setMessages;
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [messages.length]);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-md">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>

        <div className="w-full space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-md">
              <div className="font-bold">{msg.userName}</div>
              <div>{msg.message}</div>
              <div className="text-sm text-gray-500">
                {new Date(msg.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        <div 
          ref={observerTarget}
          className="w-full h-4 mt-4"
        />
      </main>
    </div>
  );
}