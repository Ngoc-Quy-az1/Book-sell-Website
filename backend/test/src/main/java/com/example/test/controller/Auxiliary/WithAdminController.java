    package com.example.test.controller.Auxiliary;

    import com.example.test.Entity.User;
    import com.example.test.Entity.chatEntity.SupportMessage;
    import com.example.test.Repository.UserRepo.UserRepository;
    import com.example.test.DTO.chatDTO.Request.ChatHistoryRequestDTO;
    import com.example.test.DTO.chatDTO.Request.ChatReplyRequestDTO;
    import com.example.test.DTO.chatDTO.Request.ChatSendRequestDTO;
    import com.example.test.Service.ChatService;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.messaging.handler.annotation.MessageMapping;
    import org.springframework.messaging.simp.SimpMessagingTemplate;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.ArrayList;

    @RestController
    @RequestMapping("/api/chat/admin")
    public class WithAdminController {

        @Autowired
        private ChatService chatService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        /**
         * Người dùng gửi tin nhắn cho admin
         * Method: POST
         * URL: http://localhost:8090/api/chat/admin/send
         * 
         * Request Body:
         * {
         *   "senderId": 1,           // ID của người gửi
         *   "message": "Xin chào"    // Nội dung tin nhắn
         * }
         * 
         * Success Response (200 OK):
         * {
         *   "id": 1,
         *   "sender": {
         *     "id": 1,
         *     "name": "Nguyen Van A"
         *   },
         *   "receiver": {
         *     "id": 2,
         *     "name": "Admin"
         *   },
         *   "message": "Xin chào",
         *   "createdAt": "2024-03-14T10:30:00"
         * }
         */
        @PostMapping("/send")
        public ResponseEntity<SupportMessage> sendMessageToAdmin(@RequestBody ChatSendRequestDTO request) {
            User sender = userRepository.findById(request.getSenderId()).orElseThrow();
            User admin = userRepository.findAll()
                .stream().filter(User::isAdmin).findFirst()
                .orElseThrow(() -> new RuntimeException("Admin not found"));

            SupportMessage result = chatService.sendPrivateMessage(sender, admin, request.getMessage());
            
            // Send via WebSocket
            messagingTemplate.convertAndSend("/topic/admin-chat/" + admin.getID(), result);
            messagingTemplate.convertAndSend("/topic/user-chat/" + sender.getID(), result);
            
            return ResponseEntity.ok(result);
        }

        /**
         * Admin phản hồi tin nhắn cho người dùng
         * Method: POST
         * URL: http://localhost:8090/api/chat/admin/reply
         * 
         * Request Body:
         * {
         *   "adminId": 2,            // ID của admin
         *   "userId": 1,             // ID của người dùng
         *   "message": "Chào bạn"    // Nội dung phản hồi
         * }
         * 
         * Success Response (200 OK):
         * {
         *   "id": 2,
         *   "sender": {
         *     "id": 2,
         *     "name": "Admin"
         *   },
         *   "receiver": {
         *     "id": 1,
         *     "name": "Nguyen Van A"
         *   },
         *   "message": "Chào bạn",
         *   "createdAt": "2024-03-14T10:31:00"
         * }
         * 
         * Error Response (400 Bad Request):
         * "Sender is not admin" - Nếu người gửi không phải là admin
         */
        @PostMapping("/reply")
        public ResponseEntity<SupportMessage> adminReplyToUser(@RequestBody ChatReplyRequestDTO request) {
            User admin = userRepository.findById(request.getAdminId()).orElseThrow();
            User user = userRepository.findById(request.getUserId()).orElseThrow();

            if (!admin.isAdmin()) {
                throw new RuntimeException("Sender is not admin");
            }

            SupportMessage result = chatService.sendPrivateMessage(admin, user, request.getMessage());
            
            // Send via WebSocket
            messagingTemplate.convertAndSend("/topic/user-chat/" + user.getID(), result);
            messagingTemplate.convertAndSend("/topic/admin-chat/" + admin.getID(), result);
            
            return ResponseEntity.ok(result);
        }

        /**
         * Lấy lịch sử chat giữa người dùng và admin
         * Method: POST
         * URL: http://localhost:8090/api/chat/admin/history
         * 
         * Request Body:
         * {
         *   "userId": 1  // ID của người dùng
         * }
         * 
         * Success Response (200 OK):
         * [
         *   {
         *     "id": 1,
         *     "sender": {
         *       "id": 1,
         *       "name": "Nguyen Van A"
         *     },
         *     "receiver": {
         *       "id": 2,
         *       "name": "Admin"
         *     },
         *     "message": "Xin chào",
         *     "createdAt": "2024-03-14T10:30:00"
         *   },
         *   {
         *     "id": 2,
         *     "sender": {
         *       "id": 2,
         *       "name": "Admin"
         *     },
         *     "receiver": {
         *       "id": 1,
         *       "name": "Nguyen Van A"
         *     },
         *     "message": "Chào bạn",
         *     "createdAt": "2024-03-14T10:31:00"
         *   }
         * ]
         */
        @PostMapping("/history")
        public ResponseEntity<List<SupportMessage>> getChatWithAdmin(@RequestBody ChatHistoryRequestDTO request) {
            User user = userRepository.findById(request.getUserId()).orElseThrow();
            User admin = userRepository.findAll().stream().filter(User::isAdmin).findFirst()
                .orElseThrow(() -> new RuntimeException("Admin not found"));

            // Lấy tin nhắn từ người dùng tới admin
            List<SupportMessage> userToAdminMessages = chatService.getPrivateMessages(user, admin);
            
            // Lấy tin nhắn từ admin tới người dùng
            List<SupportMessage> adminToUserMessages = chatService.getPrivateMessages(admin, user);
            
            // Kết hợp và sắp xếp theo thời gian
            List<SupportMessage> allMessages = new ArrayList<>();
            allMessages.addAll(userToAdminMessages);
            allMessages.addAll(adminToUserMessages);
            
            // Sắp xếp theo thời gian tăng dần (cũ đến mới)
            allMessages.sort((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()));
            
            return ResponseEntity.ok(allMessages);
        }

        // Lấy số lượng tin nhắn được nhận tới của 1 người dùng 
        // http://localhost:8090/api/chat/admin/count_messages/{userId}
        // Trả về số lượng tin nhắn chưa đọc của người dùng
        // ví dụ trả về hợp lệ 
        // 5
        
        @GetMapping("/count_messages/{userId}")
        public ResponseEntity<Integer> getCountOfMessages(@PathVariable int userId) {
            int count = chatService.getCountOfMessages(userId);
            return ResponseEntity.ok(count);
        }
    }
        
