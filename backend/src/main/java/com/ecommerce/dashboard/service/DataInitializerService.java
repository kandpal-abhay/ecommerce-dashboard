package com.ecommerce.dashboard.service;

import com.ecommerce.dashboard.entity.Product;
import com.ecommerce.dashboard.entity.Role;
import com.ecommerce.dashboard.entity.Sale;
import com.ecommerce.dashboard.entity.User;
import com.ecommerce.dashboard.repository.ProductRepository;
import com.ecommerce.dashboard.repository.RoleRepository;
import com.ecommerce.dashboard.repository.SaleRepository;
import com.ecommerce.dashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DataInitializerService implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, "ROLE_USER"));
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }

        // Initialize demo users
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(new HashSet<>(Arrays.asList(adminRole, userRole)));
            userRepository.save(admin);

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRoles(new HashSet<>(Collections.singletonList(userRole)));
            userRepository.save(user);
        }

        // Initialize sample products and sales
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                new Product(null, "Laptop", "Electronics", 899.99),
                new Product(null, "Smartphone", "Electronics", 599.99),
                new Product(null, "Headphones", "Electronics", 149.99),
                new Product(null, "T-Shirt", "Clothing", 29.99),
                new Product(null, "Jeans", "Clothing", 59.99),
                new Product(null, "Coffee Maker", "Home Appliances", 79.99),
                new Product(null, "Blender", "Home Appliances", 49.99)
            );
            productRepository.saveAll(products);

            // Generate sample sales data
            Random random = new Random();
            String[] regions = {"North", "South", "East", "West"};
            String[] paymentMethods = {"Credit Card", "Debit Card", "Cash", "UPI"};
            String[] customerNames = {"John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"};

            for (int i = 0; i < 100; i++) {
                Product product = products.get(random.nextInt(products.size()));
                int quantity = random.nextInt(5) + 1;
                double totalAmount = product.getPrice() * quantity;

                Sale sale = new Sale();
                sale.setProduct(product);
                sale.setQuantity(quantity);
                sale.setTotalAmount(totalAmount);
                sale.setSaleDate(LocalDateTime.now().minusDays(random.nextInt(90)));
                sale.setCustomerName(customerNames[random.nextInt(customerNames.length)]);
                sale.setRegion(regions[random.nextInt(regions.length)]);
                sale.setPaymentMethod(paymentMethods[random.nextInt(paymentMethods.length)]);

                saleRepository.save(sale);
            }
        }
    }
}
