package com.payment.wallet.PaymentWallet.repo;

import com.payment.wallet.PaymentWallet.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepo extends MongoRepository<Transaction, String> {
    List<Transaction> findByFromUserIdOrToUserIdOrderByCreatedAtDesc(String fromUserId, String toUserId);
    List<Transaction> findByFromUserIdOrderByCreatedAtDesc(String fromUserId);
    List<Transaction> findByToUserIdOrderByCreatedAtDesc(String toUserId);
}