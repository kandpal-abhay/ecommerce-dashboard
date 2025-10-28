package com.ecommerce.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productCategory;
    private Integer quantity;
    private Double totalAmount;
    private LocalDateTime saleDate;
    private String customerName;
    private String region;
    private String paymentMethod;
}
