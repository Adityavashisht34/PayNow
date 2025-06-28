package com.payment.wallet.PaymentWallet.service;

import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.repo.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public ResponseEntity<?> createUserAccountId(){
        ObjectId userId = new ObjectId();
        ObjectId accountId = new ObjectId();
        String[] idArr = {userId.toHexString(),accountId.toHexString()};
        return new ResponseEntity<>(idArr, HttpStatus.CREATED);
    }

    public ResponseEntity<?> createUser(User user){
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setMobile(passwordEncoder.encode(user.getMobile()));
           return new ResponseEntity<>(userRepo.save(user), HttpStatus.CREATED) ;
        }
        catch (Exception e){
            return new ResponseEntity<>("Creation Failed, Try Again.", HttpStatus.CONFLICT);
        }
    }

    public ResponseEntity<?> findUserByEmail(String email, String password){
        Optional<User> dbUser = userRepo.findByEmail(email);
        if(dbUser.isPresent()){
            if(passwordEncoder.matches(password,dbUser.get().getPassword())){
                return new ResponseEntity<>(dbUser.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<?> updatePassword(String email,String password){
        Optional<User> dbUser = userRepo.findByEmail(email);
        if(dbUser.isPresent()){
            dbUser.get().setPassword(passwordEncoder.encode(password));
            userRepo.save(dbUser.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
