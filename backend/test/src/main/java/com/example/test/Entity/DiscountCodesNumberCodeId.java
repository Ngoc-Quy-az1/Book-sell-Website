package com.example.test.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class DiscountCodesNumberCodeId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "code_id")
    private int codeId;

    @Column(name = "user_id")
    private int userId;

    public DiscountCodesNumberCodeId() {
    }

    public DiscountCodesNumberCodeId(int codeId, int numberCode, int userId) {
        this.codeId = codeId;
        this.userId = userId;
    }

    public int getCodeId() {
        return codeId;
    }

    public void setCodeId(int codeId) {
        this.codeId = codeId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        DiscountCodesNumberCodeId that = (DiscountCodesNumberCodeId) o;
        return codeId == that.codeId && userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(codeId, userId);
    }
}