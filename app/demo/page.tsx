import Auctions from "@/components/Auctions";
import { Card, CardContent } from "@/components/ui/card";

type Props = {};

const page = (props: Props) => {
  const generateNumber = () => {
    return Math.floor(Math.random() * 100);
  };
  const formattedNumber = generateNumber();

  return (
    <main className="flex-1">
      <section className="max-w-4xl mx-auto px-4 md:px-0">
        <Card>
          <CardContent className="py-8">
            <h2 className="text-3xl font-bold">Bienvenido user#{formattedNumber}</h2>
          </CardContent>
        </Card>
      </section>
      <Auctions formattedNumber={formattedNumber} />
    </main>
  );
};

export default page;
