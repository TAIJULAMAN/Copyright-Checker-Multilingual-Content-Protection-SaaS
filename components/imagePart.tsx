import Image from "next/image";

export default function ImagePart() {
  return (
    <div className="w-full bg-white">
      <div className="w-full relative">
        <Image
          src="/imagepart.png"
          alt="Section image"
          width={1920}
          height={500}
          sizes="100vw"
          className="w-full h-auto object-cover"
          priority
          quality={100}
        />
      </div>
      <div className="md:w-[300px] md:h-[100px] w-[250px] h-[80px] mx-auto mt-10">
        <Image
          src="/googlerating.png"
          alt="Section image"
          width={350}
          height={200}
          sizes="100vw"
          className="w-full h-auto object-cover"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
