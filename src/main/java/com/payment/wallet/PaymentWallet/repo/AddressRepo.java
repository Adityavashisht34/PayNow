package com.payment.wallet.PaymentWallet.repo;

import com.payment.wallet.PaymentWallet.entity.Address;
import com.payment.wallet.PaymentWallet.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddressRepo extends MongoRepository<Address, Address> {
}
