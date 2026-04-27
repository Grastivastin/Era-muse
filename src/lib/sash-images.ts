import hero from "@/assets/hero.jpg";
import eraAudrey from "@/assets/era-audrey.jpg";
import eraStevie from "@/assets/era-stevie.jpg";
import eraLana from "@/assets/era-lana.jpg";
import eraDiana from "@/assets/era-diana.jpg";
import aesCoquette from "@/assets/aes-coquette.jpg";
import aesDarkAcademia from "@/assets/aes-darkacademia.jpg";
import aesCottagecore from "@/assets/aes-cottagecore.jpg";
import aesOldMoney from "@/assets/aes-oldmoney.jpg";
import aesY2K from "@/assets/aes-y2k.jpg";
import aesIndieSleaze from "@/assets/aes-indiesleaze.jpg";
import aesWhimsigoth from "@/assets/aes-whimsigoth.jpg";
import aesBalletcore from "@/assets/aes-balletcore.jpg";
import aesMermaid from "@/assets/aes-mermaid.jpg";
import aesSoftGirl from "@/assets/aes-softgirl.jpg";
import aesRegency from "@/assets/aes-regency.jpg";
import aesCleanGirl from "@/assets/aes-cleangirl.jpg";
import pSlip from "@/assets/p-slipdress.jpg";
import pTweed from "@/assets/p-tweedblazer.jpg";
import pPrairie from "@/assets/p-prairiedress.jpg";
import pCardigan from "@/assets/p-cardigan.jpg";
import pBoho from "@/assets/p-bohomaxi.jpg";
import pHeadband from "@/assets/p-headband.jpg";
import pTulle from "@/assets/p-tulleskirt.jpg";
import pVelvet from "@/assets/p-velvetdress.jpg";
import pBabytee from "@/assets/p-babytee.jpg";
import pLeather from "@/assets/p-leatherjacket.jpg";
import pPearls from "@/assets/p-pearls.jpg";
import pCorset from "@/assets/p-corset.jpg";

export const SASH_IMAGES: Record<string, string> = {
  hero,
  "era-audrey": eraAudrey,
  "era-stevie": eraStevie,
  "era-lana": eraLana,
  "era-diana": eraDiana,
  "aes-coquette": aesCoquette,
  "aes-darkacademia": aesDarkAcademia,
  "aes-cottagecore": aesCottagecore,
  "aes-oldmoney": aesOldMoney,
  "aes-y2k": aesY2K,
  "aes-indiesleaze": aesIndieSleaze,
  "aes-whimsigoth": aesWhimsigoth,
  "aes-balletcore": aesBalletcore,
  "aes-mermaid": aesMermaid,
  "aes-softgirl": aesSoftGirl,
  "aes-regency": aesRegency,
  "aes-cleangirl": aesCleanGirl,
  "p-slipdress": pSlip,
  "p-tweedblazer": pTweed,
  "p-prairiedress": pPrairie,
  "p-cardigan": pCardigan,
  "p-bohomaxi": pBoho,
  "p-headband": pHeadband,
  "p-tulleskirt": pTulle,
  "p-velvetdress": pVelvet,
  "p-babytee": pBabytee,
  "p-leatherjacket": pLeather,
  "p-pearls": pPearls,
  "p-corset": pCorset,
};

export const sashImg = (key: string | null | undefined) =>
  (key && (key.startsWith("http") || key.startsWith("/") ? key : SASH_IMAGES[key])) || hero;