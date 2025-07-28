package com.payment.wallet.PaymentWallet.repo;

import com.payment.wallet.PaymentWallet.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepo extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findByEmailOrMobile(String email, String mobile);
    Optional<User> findByUserId(String userId);
}