package com.example.test.Entity.chatEntity;

import com.example.test.Entity.User;

import jakarta.persistence.*;

@Entity
@Table(name = "group_members")
public class GroupMembers {

    @EmbeddedId
    private GroupMembersId id;

    @ManyToOne
    @MapsId("groupId")
    @JoinColumn(name = "group_id", nullable = false)
    private ChatGroup chatGroup;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public GroupMembers() {}

    public GroupMembers(ChatGroup chatGroup, User user) {
        this.id = new GroupMembersId(chatGroup.getGroupId(), user.getID());
        this.chatGroup = chatGroup;
        this.user = user;
    }

    public GroupMembersId getId() {
        return id;
    }

    public void setId(GroupMembersId id) {
        this.id = id;
    }

    public ChatGroup getChatGroup() {
        return chatGroup;
    }

    public void setChatGroup(ChatGroup chatGroup) {
        this.chatGroup = chatGroup;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
