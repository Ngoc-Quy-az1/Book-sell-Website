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

    @Column(name = "number_code")
    private int numberCode;

    @Column(name = "user_id")
    private int userId;

    public DiscountCodesNumberCodeId() {
    }

    public DiscountCodesNumberCodeId(int codeId, int numberCode, int userId) {
        this.codeId = codeId;
        this.numberCode = numberCode;
        this.userId = userId;
    }

    public int getCodeId() {
        return codeId;
    }

    public void setCodeId(int codeId) {
        this.codeId = codeId;
    }

    public int getNumberCode() {
        return numberCode;
    }

    public void setNumberCode(int numberCode) {
        this.numberCode = numberCode;
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
        DiscountCodesNumberCodeId that = (DiscountCodesNumberCodeId) o;
        return codeId == that.codeId && numberCode == that.numberCode && userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(codeId, numberCode, userId);
    }
} 