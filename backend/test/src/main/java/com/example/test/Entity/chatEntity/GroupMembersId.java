package com.example.test.Entity.chatEntity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GroupMembersId implements Serializable {
    private int groupId;
    private int userId;

    public GroupMembersId() {}

    public GroupMembersId(int groupId, int userId) {
        this.groupId = groupId;
        this.userId = userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupMembersId that = (GroupMembersId) o;
        return groupId == that.groupId && userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId, userId);
    }
}
