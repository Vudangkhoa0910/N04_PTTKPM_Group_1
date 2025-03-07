import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Input,
  Text,
  VStack,
  Spinner,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";

const EduAIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAbgYjk5GNETwqbD83ow8EQQO3D4vV_cws",
        {
          contents: [{ parts: [{ text: input }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ") ||
        "No response";

      const formattedText = aiText.replace(/\*/g, "").replace(/<br\s*\/>/g, "\n");

      const aiMessage = { sender: "EduAI", text: formattedText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("EduAI API Error:", error);
      setMessages((prev) => [...prev, { sender: "EduAI", text: "Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        leftIcon={<FaRobot />}
        colorScheme="orange"
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex="popover"
        boxShadow="2xl"
        borderRadius="full"
        p={4}
        fontSize="lg"
        fontWeight="bold"
        _hover={{ bg: "orange.500", transform: "scale(1.05)" }}
        _active={{ bg: "orange.600", transform: "scale(0.95)" }}
      >
        EduAI
      </Button>

      {isOpen && (
        <Box
          position="fixed"
          bottom="80px"
          right="20px"
          width="320px"
          maxHeight="400px"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          p={4}
          zIndex="popover"
        >
          <HStack justify="space-between">
            <Text fontWeight="bold">EduAI Chatbox</Text>
            <IconButton
              icon={<FaTimes />}
              size="sm"
              onClick={toggleChat}
              aria-label="Close chat"
            />
          </HStack>

          <Box height="250px" overflowY="auto" p={2}>
            {messages.length === 0 ? (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Please Ask EduAI
              </Text>
            ) : (
              <VStack align="stretch" spacing={1}>
                {messages.map((msg, index) => (
                  <Text
                    key={index}
                    fontWeight={msg.sender === "EduAI" ? "bold" : "normal"}
                    color={msg.sender === "EduAI" ? "blue.600" : "black"}
                    whiteSpace="pre-line"
                  >
                    {msg.sender}: {msg.text}
                  </Text>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            )}
          </Box>

          {loading && (
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm">EduAI is thinking...</Text>
            </HStack>
          )}

          <Input
            placeholder={loading ? "Waiting for response..." : "Type a message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            isDisabled={loading}
            borderRadius="md"
          />
        </Box>
      )}
    </>
  );
};

export default EduAIChatbox;