package com.payment.wallet.PaymentWallet.service;

import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.repo.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    public ResponseEntity<?> createUserAccountId(){
        ObjectId userId = new ObjectId();
        ObjectId accountId = new ObjectId();
        String[] idArr = {userId.toHexString(),accountId.toHexString()};
        return new ResponseEntity<>(idArr, HttpStatus.CREATED);
    }

    public ResponseEntity<?> createUser(User user){
        try {
           return new ResponseEntity<>(userRepo.save(user), HttpStatus.CREATED) ;
        }
        catch (Exception e){
            return new ResponseEntity<>("Creation Failed, Try Again.", HttpStatus.CONFLICT);
        }
    }

}
