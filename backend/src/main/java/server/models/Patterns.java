package server.models;

import java.util.regex.Pattern;

public class Patterns {
    public static final Pattern EMAIL = Pattern.compile("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", Pattern.CASE_INSENSITIVE);
    // the phone number pattern requires a minimum 5 digits, with an mandatory '+' at the beginning
    public static final Pattern PHONE_NUMBER = Pattern.compile("^\\+?\\d+(\\d| ){4,}$");

    // the IBAN pattern is specifically for a Turkish IBAN
    public static final Pattern IBAN = Pattern.compile("^TR[0-9]{7}[01][0-9]{10,16}$");
}
