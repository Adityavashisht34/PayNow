package com.payment.wallet.PaymentWallet.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.util.*;
@Data
@Component
@Document(collection = "user")
public class User {
    private ObjectId userId;
    private ObjectId userAccountId;
    private String fullName;
    private String email;
    private String password;

    @DBRef
    Address addressId = null;
    @DBRef
    List<Transaction> transactionList = new ArrayList<>();
}
