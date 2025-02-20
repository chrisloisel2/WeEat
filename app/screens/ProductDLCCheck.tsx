import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import ProductScanner from '@/components/ProductScanner';

export default function ProductDLCCheck() {
  const [isCreateProductModalVisible, setCreateProductModalVisible] = useState(false);

  const toggleCreateProductModal = () => {
    setCreateProductModalVisible(!isCreateProductModalVisible);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Suivi des DLC des produits</Text>
      <Button title="Créer un produit" onPress={toggleCreateProductModal} />
      {isCreateProductModalVisible && (
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <ProductScanner />
        </View>
      )}
    </View>

);
}

