package com.ecommerce.dashboard.service;

import com.ecommerce.dashboard.dto.CreateSaleRequest;
import com.ecommerce.dashboard.dto.SaleDTO;
import com.ecommerce.dashboard.entity.Product;
import com.ecommerce.dashboard.entity.Sale;
import com.ecommerce.dashboard.repository.ProductRepository;
import com.ecommerce.dashboard.repository.SaleRepository;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    public Page<SaleDTO> getSales(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        if (startDate != null && endDate != null) {
            return saleRepository.findBySaleDateBetween(startDate, endDate, pageable)
                    .map(this::convertToDTO);
        }
        return saleRepository.findAll(pageable).map(this::convertToDTO);
    }

    public String exportSalesToCSV(LocalDateTime startDate, LocalDateTime endDate) {
        List<Sale> sales;
        if (startDate != null && endDate != null) {
            sales = saleRepository.findBySaleDateBetween(startDate, endDate);
        } else {
            sales = saleRepository.findAll();
        }

        try {
            StringWriter stringWriter = new StringWriter();
            CSVWriter csvWriter = new CSVWriter(stringWriter);

            // Write header
            String[] header = {"ID", "Product", "Category", "Quantity", "Total Amount",
                             "Sale Date", "Customer", "Region", "Payment Method"};
            csvWriter.writeNext(header);

            // Write data
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (Sale sale : sales) {
                String[] data = {
                    sale.getId().toString(),
                    sale.getProduct().getName(),
                    sale.getProduct().getCategory(),
                    sale.getQuantity().toString(),
                    sale.getTotalAmount().toString(),
                    sale.getSaleDate().format(formatter),
                    sale.getCustomerName(),
                    sale.getRegion(),
                    sale.getPaymentMethod()
                };
                csvWriter.writeNext(data);
            }

            csvWriter.close();
            return stringWriter.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export CSV", e);
        }
    }

    public SaleDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
        return convertToDTO(sale);
    }

    public SaleDTO createSale(CreateSaleRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Sale sale = new Sale();
        sale.setProduct(product);
        sale.setQuantity(request.getQuantity());
        sale.setTotalAmount(request.getTotalAmount());
        sale.setSaleDate(request.getSaleDate());
        sale.setCustomerName(request.getCustomerName());
        sale.setRegion(request.getRegion());
        sale.setPaymentMethod(request.getPaymentMethod());

        Sale savedSale = saleRepository.save(sale);
        return convertToDTO(savedSale);
    }

    public SaleDTO updateSale(Long id, CreateSaleRequest request) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        sale.setProduct(product);
        sale.setQuantity(request.getQuantity());
        sale.setTotalAmount(request.getTotalAmount());
        sale.setSaleDate(request.getSaleDate());
        sale.setCustomerName(request.getCustomerName());
        sale.setRegion(request.getRegion());
        sale.setPaymentMethod(request.getPaymentMethod());

        Sale updatedSale = saleRepository.save(sale);
        return convertToDTO(updatedSale);
    }

    public void deleteSale(Long id) {
        if (!saleRepository.existsById(id)) {
            throw new RuntimeException("Sale not found with id: " + id);
        }
        saleRepository.deleteById(id);
    }

    private SaleDTO convertToDTO(Sale sale) {
        return new SaleDTO(
            sale.getId(),
            sale.getProduct().getId(),
            sale.getProduct().getName(),
            sale.getProduct().getCategory(),
            sale.getQuantity(),
            sale.getTotalAmount(),
            sale.getSaleDate(),
            sale.getCustomerName(),
            sale.getRegion(),
            sale.getPaymentMethod()
        );
    }
}
