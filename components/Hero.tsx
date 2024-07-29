import Image from "next/image";
import { Button } from "./ui/button";
import HeroImg from "@/assets/hero.png";
import Link from "next/link";

type Props = {};

const Hero = (props: Props) => {
  return (
    <section className="flex-1 flex">
      <div className="flex-1 flex max-w-4xl mx-auto justify-between items-center flex-col md:flex-row">
        <article className="flex-1 flex items-center">
          <div className="flex flex-col gap-3 items-center md:items-start px-8 md:px-0">
            <h2 className="font-bold text-4xl text-balance text-center md:text-start">
              Encuentra lo Inesperado
            </h2>
            <p className="w-full text-sm md:text-base md:w-[40ch] text-pretty text-center md:text-start">
              Sumérgete en un mundo de subastas llenas de objetos sorprendentes
              y oportunidades únicas.
            </p>
            <Link href="/demo" legacyBehavior passHref>
              <Button className="w-fit">¡Prueba la Demo Ahora!</Button>
            </Link>
          </div>
        </article>
        <Image
          className="md:w-96 w-72 sm:w-80 max-w-[80%]"
          src={HeroImg}
          alt="Imagen de Hero de subas.io"
        />
      </div>
    </section>
  );
};

export default Hero;
