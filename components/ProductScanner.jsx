import { useState } from "react";
import { View } from "react-native";
import ScanProduct from "@/components/ScanProduct";
import CreateProduct from "@/components/CreateProduct";

export default function ProductScanner() {
  const [step, setStep] = useState("scan");
  const [barcode, setBarcode] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {step === "scan" && (
        <ScanProduct
          onProductFound={(product) => console.log("Ajout produit :", product)}
          onCreateProduct={(barcode) => {
            setBarcode(barcode);
            setStep("create");
          }}
        />
      )}

      {step === "create" && (
        <CreateProduct
          barcode={barcode}
          onCancel={() => setStep("scan")}
          onSave={() => setStep("scan")}
        />
      )}
    </View>
  );
}
