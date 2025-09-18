"use client"

import React, { useState, useRef } from 'react';
import { Plus, Paperclip, Search, Mic } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MarlinChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const anglerFishResponse = `The fish in the image is a deep-sea anglerfish, a member of the order Lophiiformes. It's a fascinating creature known for its unique and eerie appearance, which is a result of its adaptation to life in the extreme environment of the deep sea.

**Habitat and Characteristics**

**Habitat:** Deep-sea anglerfish are found worldwide in the deep, dark parts of the ocean, typically in the bathypelagic or "midnight" zone, from the surface down to over 8,000 feet (2,500 meters). They are either midwater or seafloor dwellers.

**Appearance:** They are famous for their menacing appearance, which includes a bulbous body, a huge mouth, and long, sharp, inwardly-pointing teeth. Their skin is typically dark, ranging from grey to dark brown.

**The "Lure":** The most distinctive feature is the bioluminescent lure that dangles from a modified dorsal fin ray on the top of the female's head. This lure, called an esca, contains millions of light-producing bacteria that glow brightly in the dark. The anglerfish can control the light, either flashing it to attract curious prey or hiding it with a muscular flap. This is a brilliant hunting strategy, as it conserves energy in a food-scarce environment.

**Diet:** They are ambush predators, using their lure to attract small fish and crustaceans. Their expandable jaw and stomach allow them to swallow prey up to twice their own size.

**Reproduction**

The reproduction of deep-sea anglerfish is one of the most bizarre and extreme in the animal kingdom.

**Sexual Dimorphism:** There is a vast difference between the sizes of the male and female anglerfish. Females are large, predatory, and have the lure. Males are tiny, often only a few centimeters long, and lack the lure or the large mouth and teeth.

**Parasitic Mating:** To ensure reproduction in the vast, dark ocean where finding a mate is a rare event, some species of male anglerfish are parasitic. When a male finds a female, he bites onto her and attaches permanently. His body fuses with hers, and he becomes a permanent appendage, getting all his nutrition from her bloodstream. He essentially becomes a "sperm factory," providing her with a constant supply of sperm for fertilization.

**Superstitions and Folklore**

Unlike some other deep-sea creatures like the oarfish (often called the "doomsday fish" for its supposed connection to earthquakes), there are no widespread or well-known superstitions specifically about the anglerfish. Its rarity and the difficulty of observing it in its natural habitat mean it has not been a part of human folklore for very long.

However, the general themes of deep-sea creatures and their appearances in shallower waters have, in recent times, been associated with superstition and portents of doom. For example, some people link the surfacing of deep-sea animals to impending environmental changes or natural disasters. These are modern interpretations rather than traditional folklore.`;

  const generateResponse = (query: string, hasImage: boolean) => {
    if (hasImage) {
      return anglerFishResponse;
    }
    
    const fishName = query.toLowerCase();
    return anglerFishResponse
      .replace(/fish in the image/g, fishName)
      .replace(/anglerfish/g, fishName)
      .replace(/The fish/g, `The ${fishName}`)
      .replace(/deep-sea anglerfish/g, fishName);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input || 'Image uploaded',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const query = input;
    const hasImage = !!uploadedImage;
    setInput('');
    setUploadedImage(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: generateResponse(query, hasImage),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const LoadingAnimation = () => (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div 
          className="w-16 h-16 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #ef4444 0%, #f59e0b 33%, #10b981 66%, transparent 100%)',
          }}
        />
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <div className="text-sm text-gray-600 animate-pulse">
            Thinking...
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-medium text-blue-900 mb-2">
          Hello, Marine Explorer
        </h1>
        <p className="text-blue-700">
          Ask Marlin about marine data
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-8 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-3xl p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-blue-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && <LoadingAnimation />}
      </div>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-blue-200">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-4 bg-white border border-blue-200 rounded-full px-6 py-4 shadow-lg">
              {/* Plus icon */}
              <button
                type="button"
                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              >
                <Plus className="h-5 w-5" />
              </button>

              {/* File upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              {/* Input field */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Marlin about marine data"
                className="flex-1 border-0 bg-transparent text-base placeholder:text-gray-500 focus:outline-none"
              />

              {/* Image preview */}
              {uploadedImage && (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-8 h-8 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={!input.trim() && !uploadedImage}
                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Microphone */}
              <button
                type="button"
                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarlinChat;