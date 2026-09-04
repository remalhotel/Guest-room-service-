// ==================== MENU COMPLET DE RESTAURATION ====================
const MENU_DATA = {
    'Breakfast': [
        { id: 'bf1', name: 'Continental', desc: 'Croissant, Muffin, Danish, Seasonal Fruits', price: 49 },
        { id: 'bf2', name: 'Emirati Flavors', desc: 'Harees, Chebab, Balaleet, Arabic Cheese', price: 59 },
        { id: 'bf3', name: 'Arabic Breakfast', desc: 'Hummus, Falafel, Foul, Labneh, Halloumi', price: 59 },
        { id: 'bf4', name: 'International', desc: 'Eggs, Sausage, Bacon, Hash Browns', price: 61 },
        { id: 'bf5', name: 'Choice of Eggs', desc: 'Scrambled, Fried, Boiled, Omelette', price: 25 },
        { id: 'bf6', name: 'Shakshuka', desc: 'Poached eggs in spicy tomato sauce', price: 30 },
        { id: 'bf7', name: 'Eggs Benedict Turkey Ham', desc: 'Poached eggs, turkey ham, Hollandaise', price: 30 },
        { id: 'bf8', name: 'Eggs Benedict Smoked Salmon', desc: 'Poached eggs, smoked salmon', price: 35 }
    ],
    'Soup': [
        { id: 'sp1', name: 'Traditional Lentil Soup', desc: 'Roasted cumin, lemon, crispy pita', price: 25 },
        { id: 'sp2', name: 'Minestrone Soup', desc: 'Italian vegetable soup', price: 25 },
        { id: 'sp3', name: 'Harira Soup', desc: 'Moroccan spiced soup', price: 25 },
        { id: 'sp4', name: 'Soup of the Day', desc: 'Chef\'s daily special', price: 25 }
    ],
    'Salads and Mezzeh': [
        { id: 'sl1', name: 'Classic Caesar Salad', desc: 'Lettuce, parmesan, croutons', price: 45 },
        { id: 'sl2', name: 'Chicken Caesar Salad', desc: 'Chicken, beef bacon, parmesan', price: 49 },
        { id: 'sl3', name: 'Shrimps Caesar Salad', desc: 'Grilled shrimps, parmesan', price: 59 },
        { id: 'sl4', name: 'Quinoa Salad', desc: 'Quinoa, parsley, tomato', price: 40 },
        { id: 'sl5', name: 'Fattoush', desc: 'Lettuce, mint, zaatar', price: 40 },
        { id: 'sl6', name: 'Vine Leaves', desc: 'Stuffed grape leaves', price: 40 }
    ],
    'Sandwich and Burger': [
        { id: 'sw1', name: 'Beef Burger', desc: 'Beef patty, cheddar, fries', price: 60 },
        { id: 'sw2', name: 'Mac Beef Burger', desc: 'Special beef patty', price: 65 },
        { id: 'sw3', name: 'Grilled Chicken Burger', desc: 'Chicken, jalapeño, mozzarella', price: 55 },
        { id: 'sw4', name: 'Club Sandwich', desc: 'Triple decker, turkey bacon', price: 60 },
        { id: 'sw5', name: 'Fish and Chips', desc: 'Battered fish, tartar sauce', price: 69 },
        { id: 'sw6', name: 'Chicken Quesadilla', desc: 'Mexican flavors, salsa', price: 60 },
        { id: 'sw7', name: 'Smoked Salmon Sandwich', desc: 'Cream cheese, capers', price: 55 },
        { id: 'sw8', name: 'Cheese Sandwich', desc: 'Melted cheese, vegetables', price: 45 },
        { id: 'sw9', name: 'Chicken Steak Sandwich', desc: 'Grilled chicken, mozzarella', price: 60 },
        { id: 'sw10', name: 'Beef Steak Sandwich', desc: 'Beef steak, cheddar', price: 65 }
    ],
    'Pizza': [
        { id: 'pz1', name: 'Margherita', desc: 'Mozzarella, tomato, oregano', price: 49 },
        { id: 'pz2', name: 'Vadodara', desc: 'Zucchini, eggplant, peppers', price: 59 },
        { id: 'pz3', name: 'Cajun Spiced Chicken', desc: 'Cajun chicken, peppers', price: 65 },
        { id: 'pz4', name: 'Polo', desc: 'Chicken, mushrooms', price: 60 },
        { id: 'pz5', name: 'Pepperoni', desc: 'Mozzarella, beef pepperoni', price: 65 },
        { id: 'pz6', name: 'Gorgonzola', desc: 'Gorgonzola, mozzarella, pesto', price: 69 }
    ],
    'Pasta': [
        { id: 'pt1', name: 'Spaghetti Bolognese', desc: 'Tomato sauce, minced beef', price: 56 },
        { id: 'pt2', name: 'Ravioli Spinach Ricotta', desc: 'Ricotta, spinach, parmesan', price: 69 },
        { id: 'pt3', name: 'Fettuccine Alfredo Chicken', desc: 'Creamy Alfredo, chicken', price: 60 },
        { id: 'pt4', name: 'Tagliatelle Shrimp', desc: 'Shrimp, spring onion cream', price: 60 }
    ],
    'Main Course': [
        { id: 'mc1', name: 'Lamb Machboos', desc: 'Fragrant rice, tender lamb', price: 75 },
        { id: 'mc2', name: 'Chicken Machboos', desc: 'Rice, tender chicken', price: 65 },
        { id: 'mc3', name: 'Chicken Kabsa', desc: 'Spiced rice, chicken', price: 70 },
        { id: 'mc4', name: 'Chicken Tikka Biryani', desc: 'Basmati rice, chicken tikka', price: 65 },
        { id: 'mc5', name: 'Lamb Biryani', desc: 'Basmati rice, lamb', price: 80 },
        { id: 'mc6', name: 'Vegetable Biryani', desc: 'Papadum, raita, pickles', price: 53 },
        { id: 'mc7', name: 'Hammour Fish Curry', desc: 'Hammour, curry sauce', price: 70 },
        { id: 'mc8', name: 'Paneer Butter Masala', desc: 'Paneer, tomato butter', price: 60 },
        { id: 'mc9', name: 'Gobi Masala', desc: 'Cauliflower, tomato gravy', price: 60 },
        { id: 'mc10', name: 'Vegetable Kurma', desc: 'Vegetables, coconut curry', price: 60 },
        { id: 'mc11', name: 'Butter Chicken Masala', desc: 'Chicken, tomato butter', price: 65 },
        { id: 'mc12', name: 'Kadai Paneer', desc: 'Paneer, peppers, onions', price: 60 },
        { id: 'mc13', name: 'Gobi Manchurian', desc: 'Cauliflower, Indo-Chinese', price: 60 },
        { id: 'mc14', name: 'Grilled Salmon 200g', desc: 'Lemon butter sauce', price: 90 },
        { id: 'mc15', name: 'Lamb Chops', desc: 'Marinated lamb chops', price: 85 },
        { id: 'mc16', name: 'Grilled Chicken Breast', desc: 'Mushroom sauce', price: 70 },
        { id: 'mc17', name: 'Fried Shrimp', desc: 'Breaded shrimp, tartar', price: 75 },
        { id: 'mc18', name: 'Grilled Beef Tenderloin', desc: 'Beef tenderloin', price: 85 },
        { id: 'mc19', name: 'Nasi Goreng', desc: 'Indonesian fried rice', price: 65 },
        { id: 'mc20', name: 'Plain Fried Rice', desc: 'Wok-fried rice', price: 35 }
    ],
    'Hot Beverage': [
        { id: 'hb1', name: 'Espresso', desc: 'Rich & strong', price: 16 },
        { id: 'hb2', name: 'Double Espresso', desc: 'Double shot', price: 22 },
        { id: 'hb3', name: 'Turkish Coffee', desc: 'Traditional', price: 22 },
        { id: 'hb4', name: 'Cappuccino', desc: 'Steamed milk, foam', price: 27 },
        { id: 'hb5', name: 'Caffè Latte', desc: 'Creamy milk', price: 27 },
        { id: 'hb6', name: 'Hot Chocolate', desc: 'Rich and creamy', price: 30 },
        { id: 'hb7', name: 'Americano', desc: 'Espresso, hot water', price: 20 },
        { id: 'hb8', name: 'Iced Coffee', desc: 'Refreshing', price: 22 },
        { id: 'hb9', name: 'Tea', desc: 'Fine teas selection', price: 16 }
    ],
    'Milkshake': [
        { id: 'ms1', name: 'Chocolate', desc: 'Chocolate ice cream', price: 33 },
        { id: 'ms2', name: 'Vanilla', desc: 'Vanilla ice cream', price: 33 },
        { id: 'ms3', name: 'Strawberry', desc: 'Strawberry ice cream', price: 33 }
    ],
    'Mocktail': [
        { id: 'mk1', name: 'Fruity', desc: 'Banana, strawberry, mango', price: 33 },
        { id: 'mk2', name: 'Piña Colada', desc: 'Pineapple, coconut', price: 33 },
        { id: 'mk3', name: 'Strawberry Margarita', desc: 'Strawberries, lime', price: 33 },
        { id: 'mk4', name: 'Mojito', desc: 'Mint, lime, soda', price: 33 },
        { id: 'mk5', name: 'Mai Tai', desc: 'Pineapple, orange', price: 33 },
        { id: 'mk6', name: 'Nutella Hot Chocolate', desc: 'Nutella, cocoa', price: 33 },
        { id: 'mk7', name: 'Banana Milk Coffee', desc: 'Banana, coffee, cinnamon', price: 33 }
    ],
    'Alcoholic Beverages': [
        { id: 'al1', name: 'Corona', desc: 'Mexican beer', price: 40 },
        { id: 'al2', name: 'Stella', desc: 'European lager', price: 40 },
        { id: 'al3', name: 'Heineken', desc: 'Dutch beer', price: 40 },
        { id: 'al4', name: 'Budweiser', desc: 'American beer', price: 40 },
        { id: 'al5', name: 'Hoegaarden', desc: 'Belgian wheat beer', price: 40 },
        { id: 'al6', name: 'Guinness Stout', desc: 'Irish stout', price: 44 },
        { id: 'al7', name: 'Bacardi Breezers', desc: 'Fruit flavored', price: 35 },
        { id: 'al8', name: 'Strongbow Cider', desc: 'Apple cider', price: 44 },
        { id: 'al9', name: 'Soju', desc: 'Korean spirit', price: 55 },
        { id: 'al10', name: 'Bloody Mary', desc: 'Vodka, tomato juice', price: 44 },
        { id: 'al11', name: 'Cosmopolitan', desc: 'Vodka, cranberry', price: 44 },
        { id: 'al12', name: 'Margarita', desc: 'Tequila, lemon', price: 44 },
        { id: 'al13', name: 'Piña Colada Cocktail', desc: 'Rum, coconut', price: 44 },
        { id: 'al14', name: 'Negroni', desc: 'Gin, Campari', price: 44 },
        { id: 'al15', name: 'Martini', desc: 'Gin, vermouth', price: 44 },
        { id: 'al16', name: 'Bull Frog', desc: 'Vodka, tequila, rum', price: 65 },
        { id: 'al17', name: 'Long Island Tea', desc: 'Vodka, tequila, rum, gin', price: 65 },
        { id: 'al18', name: 'Aperol Spritz', desc: 'Aperol, sparkling wine', price: 65 },
        { id: 'al19', name: 'Jim Beam Glass', desc: 'Bourbon', price: 44 },
        { id: 'al20', name: 'Jim Beam Bottle', desc: 'Full bottle', price: 470 },
        { id: 'al21', name: 'Jack Daniels Glass', desc: 'Whiskey', price: 44 },
        { id: 'al22', name: 'Jack Daniels Bottle', desc: 'Full bottle', price: 470 },
        { id: 'al23', name: 'Jameson Glass', desc: 'Irish whiskey', price: 44 },
        { id: 'al24', name: 'Jameson Bottle', desc: 'Full bottle', price: 470 },
        { id: 'al25', name: 'Glenfiddich 12Y Glass', desc: 'Single malt', price: 55 },
        { id: 'al26', name: 'Glenfiddich 12Y Bottle', desc: 'Full bottle', price: 795 },
        { id: 'al27', name: 'Hennessy VSOP Glass', desc: 'Cognac', price: 55 },
        { id: 'al28', name: 'Hennessy VSOP Bottle', desc: 'Full bottle', price: 520 },
        { id: 'al29', name: 'Hennessy XO Glass', desc: 'Premium cognac', price: 100 },
        { id: 'al30', name: 'Hennessy XO Bottle', desc: 'Full bottle', price: 1600 },
        { id: 'al31', name: 'Champagne Glass', desc: 'Sparkling flute', price: 80 },
        { id: 'al32', name: 'Champagne Bottle', desc: 'Full bottle', price: 735 },
        { id: 'al33', name: 'House Wine Glass', desc: 'Red/White/Rosé', price: 38 },
        { id: 'al34', name: 'House Wine Bottle', desc: 'Full bottle', price: 190 }
    ]
};

// Fonction pour trouver un plat par son ID
function findMenuItem(itemId) {
    for (const items of Object.values(MENU_DATA)) {
        const found = items.find(item => item.id === itemId);
        if (found) return found;
    }
    return null;
}
