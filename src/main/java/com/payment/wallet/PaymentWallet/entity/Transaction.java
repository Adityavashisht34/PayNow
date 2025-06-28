package com.payment.wallet.PaymentWallet.entity;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "transaction")
public class Transaction {
    private ObjectId transactionId;
    @DBRef
    private User userId;
    @DBRef
    private User receiverId;

    private LocalDateTime dateProcessed;
    private Long amount;
}
