package com.payment.wallet.PaymentWallet.exceptions;

public class ServerBusyException extends Exception{
    public ServerBusyException(){
        super("Server is busy, try again later!");
    }
}
