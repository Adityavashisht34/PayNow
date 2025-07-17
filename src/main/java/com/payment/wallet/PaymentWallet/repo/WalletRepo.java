package com.payment.wallet.PaymentWallet.repo;

import com.payment.wallet.PaymentWallet.entity.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WalletRepo extends MongoRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);
}