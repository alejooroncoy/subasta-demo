import { formatDistance }from "date-fns";
import { es }from "date-fns/locale";
import {
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
import Offer from "./Offer";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  auction: DocumentData;
  refAuction: QueryDocumentSnapshot<DocumentData, DocumentData>;
  formattedNumber: number;
};

type Product = {
  name: string;
  img: string;
};

const Auction = ({ auction, refAuction, formattedNumber }: Props) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [timeAgoExpire, setTimeAgoExpire] = useState("");

  const fro = new Intl.NumberFormat("es-ES", {
    currency: "EUR",
    style: "currency",
  });

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

    const offerMax = offers[0]?.data().priceOffered || 0;

    if (+priceOffered <= offerMax) {
      toast({
        title: "Error",
        description: `Tu oferta debe ser mayor a ${fro.format(offerMax)}`,
      });
      return;
    }

    await makingOffer({
      priceOffered: +priceOffered,
      createdAt: new Date(),
      auction: refAuction.ref,
      userId: formattedNumber,
    });
  };

  useEffect(() => {
    gettingProducts();
  }, [auction, gettingProducts]);

  useEffect(() => {
    const q = query(
      offersRef,
      where("auction", "==", refAuction.ref),
      orderBy("priceOffered", "desc")
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      setOffers(querySnapshot.docs);
    });

    return () => unsub();
  }, [auction, refAuction]);

  const createdAt = new Date(auction.createdAt?.toDate());

  const timeAgo = formatDistance(createdAt, new Date(), {
    addSuffix: true,
    locale: es
  });

  const timeAgoLastOffer = useMemo(() => (
    offers[0] && formatDistance(offers[0]?.data().createdAt.toDate(), new Date(), {
      addSuffix: true,
      locale: es
    })
  ), [offers]);


  useEffect(() => {
    setTimeAgoExpire(formatDistance(auction.expireAt?.toDate(), new Date(), {
      addSuffix: true,
      locale: es
    }));

    const idx = setInterval(() => {
      setTimeAgoExpire(formatDistance(auction.expireAt?.toDate(), new Date(), {
        addSuffix: true,
        locale: es
      }));
    }, 1000);

    return () => clearInterval(idx);
  }, []);

  return (
    <Card className="md:flex-row flex flex-col">
      <CardHeader className="basis-1/4">
        <img
          src={product?.img}
          className="w-full h-32 md:h-full object-cover rounded"
        />
      </CardHeader>
      <CardContent className="md:py-12 gap-2 flex items-start justify-between flex-auto">
        <div className="flex-col flex gap-2">
        <h3 className="text-xl font-semibold">{product?.name || ""}</h3>
        <p>Ofertas hasta el momento: {offers.length}</p>
        <p>Termina {timeAgoExpire}</p>
        <p>En puja {timeAgo}</p>
        <p>Última oferta realizada {timeAgoLastOffer}</p>
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
                  required
                  min={0}
                  step={0.01}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="md:hidden">
              Ver ofertas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ofertas actuales</DialogTitle>
              <DialogDescription>
                Visualiza los que están pujando.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea  className="py-4 max-h-32 pr-3 pl-1">
              {offers.map((offer, index) => (
                <Offer className="mb-2" index={index} key={offer.id} offer={offer} />
              ))}
            </ScrollArea>
          <span className="text-sm text-end">*GM: Ganador Momentáneo</span>
            
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="hidden md:block">
              Ver todas las ofertas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ofertas actuales</DialogTitle>
              <DialogDescription>
                Visualiza los que están pujando.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex flex-col gap-4 py-4 max-h-48 pr-4 pl-1">
              {offers.map((offer, index) => (
                <Offer className="mb-2" index={index} key={offer.id} offer={offer} />
              ))}
            </ScrollArea>
          <span className="text-sm text-end">*GM: Ganador Momentáneo</span>
          </DialogContent>
        </Dialog>
        </div>
        <div className="flex-col gap-3 hidden md:flex flex-1 pl-8">
          <h2 className="text-xl font-semibold">Ultimas tres ofertas</h2>
          <div className="gap-2 flex flex-col">
          {offers.slice(0, 3).map((offer, index) => (
            <Offer index={index} key={offer.id} offer={offer} />
          ))}
          </div>
          <span className="text-sm self-end">*GM: Ganador Momentáneo</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Auction;
