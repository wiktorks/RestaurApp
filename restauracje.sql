-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 16 Lip 2019, 11:51
-- Wersja serwera: 10.1.38-MariaDB
-- Wersja PHP: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `restauracje`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `alergen`
--

CREATE TABLE `alergen` (
  `Id_Alergeny` int(10) UNSIGNED NOT NULL,
  `Nazwa` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `alergen`
--

INSERT INTO `alergen` (`Id_Alergeny`, `Nazwa`) VALUES
(1, 'Mleko'),
(2, 'Jaja'),
(3, 'Zboze'),
(4, 'Orzechy'),
(5, 'Ryby');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `danie`
--

CREATE TABLE `danie` (
  `Id_Danie` int(10) UNSIGNED NOT NULL,
  `Nazwa` varchar(45) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `Cena` decimal(6,2) UNSIGNED NOT NULL,
  `Opis` varchar(500) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `Skladniki` varchar(500) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `Zdjecie` int(11) DEFAULT NULL,
  `Kategoria` varchar(45) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `fk_Restauracja` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `danie`
--

INSERT INTO `danie` (`Id_Danie`, `Nazwa`, `Cena`, `Opis`, `Skladniki`, `Zdjecie`, `Kategoria`, `fk_Restauracja`) VALUES
(3, 'Bigos', '19.99', 'Tradycyjny polski bigos', 'kapusta, kiełbasa', 13131, 'główne danie', 5),
(4, 'Żurek', '7.00', 'żurek', 'kiełbasa, sznurek', 90909, 'Zupy', 5),
(5, 'Kurczak po Wietnamsku', '19.60', 'Kurczak', 'po wietnamsku', 11111, 'główne danie', 6),
(6, 'Margherita', '15.70', 'pizza', 'margheria', 11112, 'główne danie', 7),
(7, 'Rosół', '50.00', 'droooogi', 'cośtam', 323232, 'Zupy', 5);

--
-- Wyzwalacze `danie`
--
DELIMITER $$
CREATE TRIGGER `price_average` AFTER INSERT ON `danie` FOR EACH ROW BEGIN
	DECLARE i_srednia DOUBLE;
    IF NEW.Cena IS NOT NULL AND NEW.Cena > 0 THEN
    	SELECT AVG(Cena) 
        INTO i_srednia 
        FROM danie 
        WHERE fk_Restauracja = NEW.fk_Restauracja;
        
        IF i_srednia <= 20.0 THEN 
        	UPDATE restauracja 
        	SET Srednia_Cen = 'cheap' 
        	WHERE restauracja.Id_Restaruacja = NEW.fk_Restauracja;
		ELSEIF i_srednia > 20.0 AND i_srednia < 30.0 THEN
        	UPDATE restauracja 
        	SET Srednia_Cen = 'average' 
        	WHERE restauracja.Id_Restaruacja = NEW.fk_Restauracja;
        ELSE 
        	UPDATE restauracja 
        	SET Srednia_Cen = 'expensive' 
        	WHERE restauracja.Id_Restaruacja = NEW.fk_Restauracja;
		END IF;
        
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `danie_alergen`
--

CREATE TABLE `danie_alergen` (
  `fk_Danie` int(10) UNSIGNED NOT NULL,
  `fk_Alergen` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `danie_alergen`
--

INSERT INTO `danie_alergen` (`fk_Danie`, `fk_Alergen`) VALUES
(4, 3),
(5, 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klient`
--

CREATE TABLE `klient` (
  `Id_Klient` int(10) UNSIGNED NOT NULL,
  `Login` varchar(45) CHARACTER SET utf16 COLLATE utf16_bin NOT NULL,
  `Haslo` varchar(45) CHARACTER SET utf16 COLLATE utf16_bin NOT NULL,
  `Email` varchar(45) CHARACTER SET utf16 COLLATE utf16_bin NOT NULL,
  `Imie` varchar(45) CHARACTER SET utf16 COLLATE utf16_polish_ci DEFAULT NULL,
  `Nazwisko` varchar(45) CHARACTER SET utf16 COLLATE utf16_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `klient`
--

INSERT INTO `klient` (`Id_Klient`, `Login`, `Haslo`, `Email`, `Imie`, `Nazwisko`) VALUES
(6, 'anton', 'admin', 'asdf@fdsa.pl', 'Antoni', 'Kowalski'),
(7, 'aNowak', 'rewrwr', 'qqq@aaa.pl', 'Adrian', 'shepard'),
(8, 'linx', 'wwwww', 'linx@gmail.com', 'adam', 'mada'),
(9, 'ng', 'adda', 'ng@wp.pl', 'adrian', 'nowak'),
(10, 'adsf', 'fdsa', 'asdf@o2.pl', 'Wociecj', 'aaa'),
(11, 'wiktorks', 'asdfg', 'wik@mail.com', NULL, NULL),
(12, 'benek', 'qwerty', 'benek@yo.pl', NULL, NULL),
(13, 'ratatuj', 'asd', 'a@b.c', 'Wiktor', 'Kosterski');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klient_restauracja`
--

CREATE TABLE `klient_restauracja` (
  `Komentarz` varchar(500) CHARACTER SET utf16 COLLATE utf16_polish_ci DEFAULT NULL,
  `Ocena` tinyint(1) UNSIGNED ZEROFILL NOT NULL,
  `fk_Klient` int(10) UNSIGNED NOT NULL,
  `fk_Restauracja1` int(10) UNSIGNED NOT NULL,
  `Data_Dodania` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `klient_restauracja`
--

INSERT INTO `klient_restauracja` (`Komentarz`, `Ocena`, `fk_Klient`, `fk_Restauracja1`, `Data_Dodania`) VALUES
('Bardzo fajna knajpa :)', 5, 6, 5, 0),
(NULL, 2, 8, 5, 0),
(NULL, 3, 8, 6, 0),
(NULL, 4, 9, 5, 0),
(NULL, 4, 10, 6, 0),
('asdf', 4, 12, 5, 1561447979069),
('erere', 5, 12, 6, 1561414728064);

--
-- Wyzwalacze `klient_restauracja`
--
DELIMITER $$
CREATE TRIGGER `srednia` AFTER INSERT ON `klient_restauracja` FOR EACH ROW BEGIN
	DECLARE i_srednia DOUBLE;
    IF NEW.Ocena IS NOT NULL AND NEW.Ocena > 0 AND NEW.Ocena < 6 THEN
    	SELECT AVG(Ocena) 
        INTO i_srednia 
        FROM klient_restauracja 
        WHERE fk_Restauracja1 = NEW.fk_Restauracja1;
        
        UPDATE restauracja 
        SET Srednia_Ocen = i_srednia 
        WHERE restauracja.Id_Restaruacja = NEW.fk_Restauracja1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klient_ulubione`
--

CREATE TABLE `klient_ulubione` (
  `fk_Klient` int(10) UNSIGNED NOT NULL,
  `fk_Restauracja` int(10) UNSIGNED NOT NULL,
  `Dodano` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Zrzut danych tabeli `klient_ulubione`
--

INSERT INTO `klient_ulubione` (`fk_Klient`, `fk_Restauracja`, `Dodano`) VALUES
(7, 5, '0000-00-00'),
(12, 5, '0000-00-00');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `kuchnia`
--

CREATE TABLE `kuchnia` (
  `Id_Kuchnia` int(10) UNSIGNED NOT NULL,
  `Nazwa` varchar(45) NOT NULL,
  `Zdjecie` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `kuchnia`
--

INSERT INTO `kuchnia` (`Id_Kuchnia`, `Nazwa`, `Zdjecie`) VALUES
(1, 'Orientalna', 123),
(2, 'Wloska', 321),
(8, 'Amerykanska', 666),
(9, 'Polska', 777),
(10, 'Inna', 3232);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `restauracja`
--

CREATE TABLE `restauracja` (
  `Id_Restaruacja` int(10) UNSIGNED NOT NULL,
  `Nazwa` varchar(50) CHARACTER SET utf16 COLLATE utf16_polish_ci DEFAULT NULL,
  `Opis` varchar(500) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `Adres` varchar(45) CHARACTER SET utf16 COLLATE utf16_polish_ci NOT NULL,
  `Tagi` varchar(50) CHARACTER SET utf16 COLLATE utf16_polish_ci DEFAULT NULL,
  `Koszt_Dostawy` decimal(4,2) UNSIGNED DEFAULT NULL,
  `Min_Kwota_Zamowienia` decimal(4,2) UNSIGNED NOT NULL,
  `Czas_Oczekiwania` tinyint(1) UNSIGNED NOT NULL,
  `Srednia_Ocen` float UNSIGNED NOT NULL,
  `Zdjecie` int(11) DEFAULT NULL,
  `fk_Kuchnia` int(10) UNSIGNED NOT NULL,
  `fk_Wlasciciel` int(10) UNSIGNED NOT NULL,
  `Srednia_Cen` enum('cheap','average','expensive') NOT NULL,
  `Miasto` varchar(30) NOT NULL,
  `Numer` varchar(20) NOT NULL,
  `Nr_Domu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `restauracja`
--

INSERT INTO `restauracja` (`Id_Restaruacja`, `Nazwa`, `Opis`, `Adres`, `Tagi`, `Koszt_Dostawy`, `Min_Kwota_Zamowienia`, `Czas_Oczekiwania`, `Srednia_Ocen`, `Zdjecie`, `fk_Kuchnia`, `fk_Wlasciciel`, `Srednia_Cen`, `Miasto`, `Numer`, `Nr_Domu`) VALUES
(5, 'Chłopskie Jadło', 'Nowa restauracja niedaleko centrum. Otwarta codziennie między 10.00 a 21.00. Także dowozimy.', 'Długa', 'polska, smaczna, zdrowa', '5.50', '20.00', 60, 3.75, 3334, 9, 1, 'average', 'Warszawa', '123-456-789', 8),
(6, 'Wong Dong', 'Chińska knajpa otwarta codziennie między 9.00 a 22.00. Możliwość dostawy.', 'Długa', 'chińska, tania, duzo', '4.00', '30.00', 80, 4, 323222, 1, 2, 'cheap', 'Kraków', '413-324-567', 16),
(7, 'Ristorante', 'Tradycyjna włoska pizza wyrabiana w tradycyjnym włoskim piecu.', 'Długa', 'Włoska, pizza', NULL, '15.00', 50, 0, 13131, 2, 2, 'cheap', 'Kraków', '420-666-137', 4),
(8, 'Rest', 'asdasdasd', 'Krótka', 'aaa', '12.00', '11.00', 100, 3.4, 1212, 9, 1, 'cheap', 'Kraków', '987-654-321', 10);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wlasciciel`
--

CREATE TABLE `wlasciciel` (
  `Id_Wlasciciel` int(10) UNSIGNED NOT NULL,
  `Login` varchar(45) NOT NULL,
  `Haslo` varchar(45) NOT NULL,
  `Imie` varchar(45) DEFAULT NULL,
  `Nazwisko` varchar(45) DEFAULT NULL,
  `E-mail` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `wlasciciel`
--

INSERT INTO `wlasciciel` (`Id_Wlasciciel`, `Login`, `Haslo`, `Imie`, `Nazwisko`, `E-mail`) VALUES
(1, 'jKowalski', 'admin', 'Jan', 'Kowalski', 'jKowalski@gmail.com'),
(2, 'aNowak', 'qwerty', 'Adrian', 'Nowak', 'aNowak@onet.pl');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `alergen`
--
ALTER TABLE `alergen`
  ADD PRIMARY KEY (`Id_Alergeny`),
  ADD UNIQUE KEY `Id_Alergeny_UNIQUE` (`Id_Alergeny`);

--
-- Indeksy dla tabeli `danie`
--
ALTER TABLE `danie`
  ADD PRIMARY KEY (`Id_Danie`,`fk_Restauracja`),
  ADD KEY `fk_Restauracja_idx` (`fk_Restauracja`);

--
-- Indeksy dla tabeli `danie_alergen`
--
ALTER TABLE `danie_alergen`
  ADD KEY `fk_Alergen_idx` (`fk_Alergen`),
  ADD KEY `fk_Danie_idx` (`fk_Danie`);

--
-- Indeksy dla tabeli `klient`
--
ALTER TABLE `klient`
  ADD PRIMARY KEY (`Id_Klient`),
  ADD UNIQUE KEY `Id_Klient_UNIQUE` (`Id_Klient`),
  ADD UNIQUE KEY `Login_UNIQUE` (`Login`),
  ADD UNIQUE KEY `Email_UNIQUE` (`Email`);

--
-- Indeksy dla tabeli `klient_restauracja`
--
ALTER TABLE `klient_restauracja`
  ADD PRIMARY KEY (`fk_Klient`,`fk_Restauracja1`),
  ADD KEY `fk_Klient_idx` (`fk_Klient`),
  ADD KEY `fk_Restauracja1_idx` (`fk_Restauracja1`);

--
-- Indeksy dla tabeli `klient_ulubione`
--
ALTER TABLE `klient_ulubione`
  ADD PRIMARY KEY (`fk_Klient`,`fk_Restauracja`),
  ADD KEY `fk_restauracje` (`fk_Restauracja`);

--
-- Indeksy dla tabeli `kuchnia`
--
ALTER TABLE `kuchnia`
  ADD PRIMARY KEY (`Id_Kuchnia`),
  ADD UNIQUE KEY `Id_Kuchnia_UNIQUE` (`Id_Kuchnia`);

--
-- Indeksy dla tabeli `restauracja`
--
ALTER TABLE `restauracja`
  ADD PRIMARY KEY (`Id_Restaruacja`,`fk_Kuchnia`,`fk_Wlasciciel`),
  ADD KEY `fk_Kuchnia_idx` (`fk_Kuchnia`),
  ADD KEY `fk_Wlasciciel_idx` (`fk_Wlasciciel`);

--
-- Indeksy dla tabeli `wlasciciel`
--
ALTER TABLE `wlasciciel`
  ADD PRIMARY KEY (`Id_Wlasciciel`),
  ADD UNIQUE KEY `Id_Wlasciciel_UNIQUE` (`Id_Wlasciciel`),
  ADD UNIQUE KEY `Login_UNIQUE` (`Login`),
  ADD UNIQUE KEY `E-mail_UNIQUE` (`E-mail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `alergen`
--
ALTER TABLE `alergen`
  MODIFY `Id_Alergeny` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `danie`
--
ALTER TABLE `danie`
  MODIFY `Id_Danie` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT dla tabeli `klient`
--
ALTER TABLE `klient`
  MODIFY `Id_Klient` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT dla tabeli `kuchnia`
--
ALTER TABLE `kuchnia`
  MODIFY `Id_Kuchnia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT dla tabeli `restauracja`
--
ALTER TABLE `restauracja`
  MODIFY `Id_Restaruacja` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT dla tabeli `wlasciciel`
--
ALTER TABLE `wlasciciel`
  MODIFY `Id_Wlasciciel` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `danie`
--
ALTER TABLE `danie`
  ADD CONSTRAINT `fk_Restauracja` FOREIGN KEY (`fk_Restauracja`) REFERENCES `restauracja` (`Id_Restaruacja`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Ograniczenia dla tabeli `danie_alergen`
--
ALTER TABLE `danie_alergen`
  ADD CONSTRAINT `fk_Alergen` FOREIGN KEY (`fk_Alergen`) REFERENCES `alergen` (`Id_Alergeny`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Danie` FOREIGN KEY (`fk_Danie`) REFERENCES `danie` (`Id_Danie`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `klient_restauracja`
--
ALTER TABLE `klient_restauracja`
  ADD CONSTRAINT `fk_Klient` FOREIGN KEY (`fk_Klient`) REFERENCES `klient` (`Id_Klient`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Restauracja1` FOREIGN KEY (`fk_Restauracja1`) REFERENCES `restauracja` (`Id_Restaruacja`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `klient_ulubione`
--
ALTER TABLE `klient_ulubione`
  ADD CONSTRAINT `fk_klienci` FOREIGN KEY (`fk_Klient`) REFERENCES `klient` (`Id_Klient`),
  ADD CONSTRAINT `fk_restauracje` FOREIGN KEY (`fk_Restauracja`) REFERENCES `restauracja` (`Id_Restaruacja`);

--
-- Ograniczenia dla tabeli `restauracja`
--
ALTER TABLE `restauracja`
  ADD CONSTRAINT `fk_Kuchnia` FOREIGN KEY (`fk_Kuchnia`) REFERENCES `kuchnia` (`Id_Kuchnia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Wlasciciel` FOREIGN KEY (`fk_Wlasciciel`) REFERENCES `wlasciciel` (`Id_Wlasciciel`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
