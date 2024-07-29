import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { createOffer, offersRef } from "@/lib/firebase/offers";
import { Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";

type Props = {
  auction: DocumentData;
  refAuction: QueryDocumentSnapshot<DocumentData, DocumentData>;
};

type Product = {
  name: string;
  img: string;
};

const Auction = ({ auction, refAuction }: Props) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [offers, setOffers] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);

  const gettingProducts = useCallback(async () => {
    const productDoc = await getDoc(auction.product);
    setProduct(productDoc.data() as Product);
  }, [auction]);

  const makingOffer = async (data: unknown) => {
    setLoading(true);
    await createOffer(data);
    toast({
      title: "Oferta realizada",
      description: "Tu oferta ha sido realizada con éxito, ¡suerte!",
    });
    setLoading(false);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const priceOffered = form.get("priceOffered") as string;

    await makingOffer({
      priceOffered: +priceOffered,
      createdAt: new Date(),
      auction: refAuction.ref,
    });
  };

  useEffect(() => {
    gettingProducts();
  }, [auction, gettingProducts]);

  useEffect(() => {
    const q = query(offersRef, where("auction", "==", refAuction.ref));

    const unsub = onSnapshot(q, (querySnapshot) => {
      setOffers(querySnapshot.docs);
    });

    return () => unsub();
  }, [auction, refAuction]);

  return (
    <Card className="md:flex-row flex flex-col">
      <CardHeader>
        <img src={product?.img} className="w-full h-16 md:h-full object-cover md:w-32 rounded" />
      </CardHeader>
      <CardContent className="md:py-12 gap-2 flex-col flex">
        <h3 className="text-xl font-semibold">{product?.name || ""}</h3>
        <p>Ofertas hasta el momento: {offers.length}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Hacer una oferta</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hacer una oferta</DialogTitle>
              <DialogDescription>
                Crea una oferta para el producto seleccionado. Recuerda que una
                vez que hagas una oferta no podrás cambiarla.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <form
                onSubmit={handleSubmit}
                id="form-offer"
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor="name" className="text-right">
                  Oferta
                </Label>
                <Input
                  type="number"
                  name="priceOffered"
                  placeholder="¿Cuánto quieres ofertar?"
                  className="col-span-3"
                />
              </form>
            </div>
            <DialogFooter>
              <Button disabled={loading} form="form-offer" type="submit">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ofertar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Auction;
