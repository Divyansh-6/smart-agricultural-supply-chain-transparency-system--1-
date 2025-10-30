
import { StageName } from './types';
import { Leaf, Truck, Building, Store, ShoppingCart, CheckCircle } from 'lucide-react';

export const STAGE_DETAILS: Record<StageName, { description: string; Icon: React.ElementType }> = {
  [StageName.HARVESTED]: { description: 'Harvested at the Farm', Icon: Leaf },
  [StageName.IN_TRANSIT]: { description: 'In Transit to Distributor', Icon: Truck },
  [StageName.AT_DISTRIBUTOR]: { description: 'Received by Distributor', Icon: Building },
  [StageName.IN_TRANSIT_TO_CONSUMER]: { description: 'In Transit to Consumer', Icon: Truck },
  [StageName.AT_CONSUMER]: { description: 'Received by Consumer', Icon: Store },
  [StageName.AVAILABLE_FOR_SALE]: { description: 'Available for Sale', Icon: ShoppingCart },
  [StageName.SOLD]: { description: 'Sold to Consumer', Icon: CheckCircle },
};
