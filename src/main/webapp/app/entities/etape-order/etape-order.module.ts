import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtapeOrderComponent } from './list/etape-order.component';
import { EtapeOrderDetailComponent } from './detail/etape-order-detail.component';
import { EtapeOrderUpdateComponent } from './update/etape-order-update.component';
import { EtapeOrderDeleteDialogComponent } from './delete/etape-order-delete-dialog.component';
import { EtapeOrderRoutingModule } from './route/etape-order-routing.module';

@NgModule({
  imports: [SharedModule, EtapeOrderRoutingModule],
  declarations: [EtapeOrderComponent, EtapeOrderDetailComponent, EtapeOrderUpdateComponent, EtapeOrderDeleteDialogComponent],
  entryComponents: [EtapeOrderDeleteDialogComponent],
})
export class EtapeOrderModule {}
