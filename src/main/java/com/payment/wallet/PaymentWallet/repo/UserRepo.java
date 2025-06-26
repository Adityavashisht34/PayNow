package com.payment.wallet.PaymentWallet.repo;

import com.payment.wallet.PaymentWallet.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, User> {
}
