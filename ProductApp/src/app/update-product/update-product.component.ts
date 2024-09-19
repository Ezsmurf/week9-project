import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    units: 0
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id!).subscribe((data) => {
      this.product = data;
    });
  }

  updateProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.updateProduct(id!, this.product).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}
