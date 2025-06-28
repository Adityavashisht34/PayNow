package com.payment.wallet.PaymentWallet.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.util.*;
@Data
@Component
@Document(collection = "user")
public class User {
    @Id
    private String userId;

    private String userAccountId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String mobile;
    @DBRef
    Address addressId = null;
    @DBRef
    List<Transaction> transactionList = new ArrayList<>();
}
