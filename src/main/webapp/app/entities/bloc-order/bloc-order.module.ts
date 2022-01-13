import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BlocOrderComponent } from './list/bloc-order.component';
import { BlocOrderDetailComponent } from './detail/bloc-order-detail.component';
import { BlocOrderUpdateComponent } from './update/bloc-order-update.component';
import { BlocOrderDeleteDialogComponent } from './delete/bloc-order-delete-dialog.component';
import { BlocOrderRoutingModule } from './route/bloc-order-routing.module';

@NgModule({
  imports: [SharedModule, BlocOrderRoutingModule],
  declarations: [BlocOrderComponent, BlocOrderDetailComponent, BlocOrderUpdateComponent, BlocOrderDeleteDialogComponent],
  entryComponents: [BlocOrderDeleteDialogComponent],
})
export class BlocOrderModule {}
