package com.payment.wallet.PaymentWallet.entity;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "address")
public class Address {
    private ObjectId addressId;
    private String street;
    private String sector;
    private String state;
    private String country;
}
