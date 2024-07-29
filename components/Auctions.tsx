"use client";

import { getAuctions } from "@/lib/firebase/auctions";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Auction from "./Auction";
import { Toaster } from "./ui/toaster";

type Props = {}

const Auctions = (props: Props) => {

  const [auctions, setActuions] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);

  const gettingAuctions = async () => {
    const auctions = await getAuctions();
    setActuions(auctions);

  }
  useEffect(() => {
    gettingAuctions();
  }, []);
  return (
    <section className="max-w-4xl mx-auto py-8">
      <div className="gap-3 flex flex-col px-3 md:px-0">
        <h2 className="text-2xl font-semibold">Subastas del día</h2>
        <div>
          {
            auctions.map((auction) => {
              const data = auction.data();
              return (
                <Auction key={auction.id} refAuction={auction} auction={data} />
              )
            })
          }
        </div>
      </div>
      <Toaster />
    </section>
  )
}

export default Auctions