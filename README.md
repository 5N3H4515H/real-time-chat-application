# Real-Time Chat Application

This real-time chat application utilizes Spring Boot WebSocket for the server-side implementation and ReactJS for the client-side interface, providing seamless communication between users in group and private chat settings.

## ReactJS Screenshots

### Connection Screen
![Connect](preview/connect.PNG)

### Group Chat Screen
![Group_chat](preview/group_chat.PNG)

### Private Chat Screen
![Private_chat](preview/private_chat.PNG)

## Getting Started

Follow these steps to set up and run the chat application:

### Client

1. **Install Dependencies:**
   
   Navigate to the `vite-client` folder and run:
   ```bash
   npm install
   ```

2. **Start the Client:**

   ```bash
   npm run dev
   ```

   This command will start the ReactJS client, enabling users to connect to the chat server.

### Server

1. **Run the Spring Boot Server:**

   Navigate to the `chatserver` folder and execute:
   ```bash
   mvn spring-boot:run
   ```

   The Spring Boot WebSocket server will be up and running, allowing real-time communication between clients.

## Features

- **Group Chat:** Engage in group discussions with multiple users in real time.

- **Private Chat:** Initiate private one-on-one conversations securely.

- **Sleek Interface:** Enjoy a user-friendly interface designed for efficient communication.

## How to Use

1. **Connect:**
   - Access the application at the specified URL.
   - Use the connection screen to join the chat room.

2. **Group Chat:**
   - Once connected, you can participate in group conversations instantly.

3. **Private Chat:**
   - Navigate to the private chat section to initiate private conversations with specific users.

## Customization

Feel free to customize the chat application according to your requirements. You can modify the UI, add additional features, or integrate authentication mechanisms for enhanced security.

## Dependencies

- **Server:** Spring Boot, WebSocket
- **Client:** ReactJS, Vite

## Support

For any issues or questions, please reach out to the developers through the repository's issue tracker.

---

Thank you for using the Real-Time Chat Application! We hope you enjoy seamless communication with this powerful and intuitive chat platform. If you need any assistance or have suggestions for improvement, don't hesitate to get in touch. Happy chatting!
