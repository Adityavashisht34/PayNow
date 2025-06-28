package com.payment.wallet.PaymentWallet.controllers;

import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.exceptions.ServerBusyException;
import com.payment.wallet.PaymentWallet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @Transactional
    @GetMapping("/")
    public ResponseEntity<?> createUserAccountId(){
        try {
            return new ResponseEntity<>(userService.createUserAccountId(), HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>("Server is busy, try again later!",HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PostMapping("/save-user")
    public ResponseEntity<?> createUser(@RequestBody User user){
            return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @Transactional
    @PostMapping("/find-user")
    public ResponseEntity<?> findUser(@RequestBody User user){
        try{
           return userService.findUserByEmail(user.getEmail(), user.getPassword());
        }
        catch (Exception e){
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }
    @Transactional
    @PatchMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody User user){
        try{
            return userService.updatePassword(user.getEmail(),user.getPassword());
        }
        catch (Exception e){
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }
}
