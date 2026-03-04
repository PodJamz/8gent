'use client';

import { HackathonCard } from "@/components/hackathon-card";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  InView,
  TextEffect,
  AnimatedGroup,
  FadeIn,
  FadeInUp,
  FadeInBlur
} from "@/components/motion";
import { PageTransition } from '@/components/ios';
import { ResumeContactCard } from "@/components/resume/ResumeContactCard";
import { CursorStatsCard } from "@/components/resume/CursorStatsCard";

const BLUR_FADE_DELAY = 0.04;

export default function ResumePage() {
  // ────────────────────────────────────────────────────────────────────────
  // Language toggle state
  const [lang, setLang] = useState<"en" | "pt">("en");
  const toggleLang = () => setLang((l) => (l === "en" ? "pt" : "en"));

  // Hard‑coded Portuguese strings (from your translations)
  const pt = {
    heroGreeting: `Olá, sou ${DATA.name.split(" ")[0]} 👋`,
    heroDesc: "Tecnólogo Criativo Bilíngue especializado em engenharia de prototipagem rápida, orquestração de IA agêntica e desenvolvimento orientado a produto. Transformo visões ambiciosas em soluções prontas para produção.",
    summary: `Sou um Tecnólogo Criativo Bilíngue com mais de 12 anos conectando design, engenharia e estratégia de produto. Minha expertise principal está em três disciplinas interconectadas:

**Engenharia de Prototipagem Rápida** - Construo MVPs com qualidade de produção em velocidade excepcional. Do conceito à solução em produção em dias, não meses. Aperfeiçoei a arte do desenvolvimento de alta velocidade, sabendo quando otimizar para aprendizado vs. escala, e como arquitetar sistemas que evoluem graciosamente.

**Orquestração de IA Agêntica** - Projeto e implemento workflows nativos de IA onde múltiplos agentes colaboram para resolver problemas complexos. Especializo-me em gestão de contexto, engenharia de prompts e construção de sistemas onde a IA amplifica a capacidade humana em vez de substituí-la. Isso inclui orquestrar Claude, GPT e agentes personalizados para automatizar pesquisa, geração de código e suporte à decisão.

**Pensamento Orientado a Produto** - Abordo cada decisão técnica através da lente de valor para o usuário. Facilito workshops, defino jobs-to-be-done e lidero equipes para entregar resultados, não apenas outputs. Meu processo é prático e iterativo, sempre mantendo as necessidades do usuário e os objetivos do negócio no centro.

Prospero em ambientes onde posso operar como um multiplicador de força, pegando a visão do fundador, traduzindo-a em arquitetura técnica, e liderando a execução do conceito até a entrega em produção. Dou o meu melhor quando construo o futuro ao lado de equipes altamente motivadas que valorizam velocidade, excelência e impacto.`,
    work: [
      `Prestando consultoria especializada a múltiplas startups stealth de IA nos setores de memória de IA, medicina, direito e finanças, sempre trazendo um olhar de design para cada produto. Liderei iniciativas de produto ponta a ponta, traduzindo ideias complexas de fundadores e visionários em requisitos técnicos acionáveis e MVPs, guiando times do conceito inicial ao protótipo rápido e entrega em produção. Atuei de forma autônoma: facilitando workshops colaborativos com fundadores, stakeholders e usuários para definir jobs-to-be-done e propostas de valor reais, tomando decisões, rodando experimentos e assumindo a entrega enquanto multiplicava a produtividade ao meu redor. Promovi o desenvolvimento nativo em IA, orientado por produto, aproveitando ferramentas modernas e ciclos iterativos para acelerar o aprendizado, ampliar o impacto e garantir que cada solução entregasse valor real para usuários e negócios. Trabalhei de perto com engenheiros e builders, cultivando uma cultura de escuta ativa, resolução colaborativa de problemas e liderança prática, impulsionando a adoção de práticas modernas de desenvolvimento de alta velocidade. Construí e iterei sistemas cloud-native que escalam entre domínios e times, sempre focado em entregar soluções práticas e centradas no usuário da forma mais eficiente possível. Aprofundei expertise em gestão de contexto de IA e orquestração, além de aprimorar habilidades de prototipagem rápida para produtos multidomínio.`,
      `Entreguei desenvolvimento front-end de alto impacto para um sistema de pesquisa jurídica por IA de ponta. Focado em soluções escaláveis e de alta eficiência para escritórios de advocacia de primeira linha na Austrália. Assumi a entrega do produto do conceito ao lançamento, iterando rapidamente com base no feedback. Integrei recursos de IA e automação para otimizar fluxos de trabalho jurídicos. Desenvolvi habilidades avançadas em legal tech, automação e design centrado no usuário para serviços profissionais.`,
      `Liderei aceleração de produto e iniciativas de crescimento estratégico. Ofereci orientação especializada em estratégia de produto, otimização da jornada do usuário e desenvolvimento front-end ágil. Liderei times multifuncionais para validar e entregar rapidamente novas funcionalidades. Usei dados reais de usuários e feedback para impulsionar melhorias contínuas. Ganhei experiência em análise de mercado, estratégia de crescimento e entrega ágil de produto em escala.`,
      `Liderei roteiros completos de IA em setores diversos. Conduzi sessões estratégicas executivas, desenvolvimento de produto front-end e inovação interdisciplinar para os setores financeiro e musical. Construí e escalei soluções nativas de IA, focando em valor de longo prazo e sustentabilidade de sistemas. Mentorei times em práticas modernas de desenvolvimento e experimentação. Expandi liderança em IA cross-industry, estratégia executiva e arquitetura sustentável de produtos.`,
      `Influenciei a direção do produto por meio de análise aprofundada de tendências. Modelei e conduzi workshops de IA que moldaram decisões estratégicas e inspiraram abordagens inovadoras na organização. Promovi uma cultura de experimentação e resolução pragmática de problemas. Liderei iniciativas que atravessaram times e domínios, gerando impacto mensurável no negócio. Aprimorei habilidades em análise de tendências, facilitação de workshops e influência de stakeholders.`,
      `Contribuindo com conselhos visionários em políticas nacionais para impulsionar inovação em autismo. Ativamente moldando um ambiente mais inclusivo e fortalecido para comunidades neurodivergentes. Colaborei com stakeholders diversos para influenciar estratégia e política nacional. Ganhei experiência em advocacy, engajamento no setor público e desenvolvimento de políticas inclusivas.`,
      `Revitalizei capacidades de produto criando uma linha inovadora de AR. Gerenciei fluxos de trabalho ágeis, defini roteiros estratégicos e guiei times multifuncionais ao sucesso. Aprimorei habilidades em desenvolvimento de produto AR/VR, gestão ágil de projetos e liderança multifuncional. Entreguei uma nova linha de produto do conceito ao lançamento, aprendendo a equilibrar viabilidade técnica com experiência do usuário.`,
      `Fundei e liderei uma startup pioneira de AR. Garanti financiamento, direcionei a visão de produto, conduzi o desenvolvimento de software e executei um plano estratégico de go-to-market. Desenvolvi habilidades empreendedoras, captação de recursos e ownership de produto de ponta a ponta. Aprendi a construir e escalar times, além de navegar pelos desafios do crescimento inicial.`,
      `Assegurei confiabilidade e conformidade de equipamentos laboratoriais de ponta. Ofereci suporte técnico essencial, mantendo um ambiente de pesquisa seguro e eficiente. Ganhei expertise em operações técnicas, compliance e melhoria de processos. Aprimorei habilidades de resolução de problemas e atenção a detalhes em ambientes de alta responsabilidade.`,
      `Estruturei expansão de mercado para a América Latina por meio de mapeamento detalhado de concorrentes e geração de leads. Influenciei decisões de alto nível sobre crescimento regional. Desenvolvi habilidades em desenvolvimento internacional de negócios, pesquisa de mercado e gestão de relacionamentos. Aprendi a adaptar estratégias para novos mercados e culturas diversas.`,
      `Otimizei operações de comércio internacional, identificando fornecedores confiáveis e negociando termos favoráveis. Naveguei por estruturas legais complexas para garantir resultados comerciais bem-sucedidos. Desenvolvi habilidades de negociação, gestão de contratos e comunicação internacional. Aprimorei a capacidade de gerenciar riscos e garantir compliance em comércio global.`,
      `Desenvolvi e implementei programas de inglês integrados com tecnologia de ponta para aprendizagem. Melhorei resultados educacionais por meio de designs inovadores de cursos e soluções de TI. Ganhei experiência em design curricular, tecnologia educacional e liderança em sala de aula. Aprendi a comunicar ideias complexas de forma simples e adaptar o ensino a diferentes perfis de alunos.`,
      `Gerenciei todos os aspectos da banda, de reservas e folha de pagamento a branding e turnês. Fortaleci a presença de mercado do grupo por meio de planejamento estratégico e iniciativas de marketing. Desenvolvi habilidades em direção criativa, organização de eventos e coordenação de equipes. Aprendi a gerenciar projetos de ponta a ponta e fomentar um ambiente criativo e colaborativo.`
    ],
    hackathon:
      `Organizei um hackathon de agentes de IA para mais de 100 participantes, focado em criar soluções inovadoras usando agentes de IA.`,
  };

  // Helpers to choose English vs Portuguese:
  const S = lang === "en" ? DATA.summary : pt.summary;
  const D = lang === "en" ? DATA.description : pt.heroDesc;
  const greeting = lang === "en" ? `Hi, I'm ${DATA.name.split(" ")[0]} 👋` : pt.heroGreeting;

  return (
    <PageTransition>
      {/* Back button - fixed position top left */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>

    <div
      className="max-w-2xl mx-auto py-12 sm:py-24 px-6"
      style={{
        fontFamily: 'var(--theme-font, inherit)',
        color: 'hsl(var(--theme-foreground))'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.main
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col min-h-[100dvh] space-y-10"
        >
          <section id="hero">
            <div className="mx-auto w-full max-w-2xl space-y-8">
              <div className="gap-2 flex justify-between">
                <div className="flex-col flex flex-1 space-y-1.5">
                  <TextEffect
                    per="word"
                    preset="blur"
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                  >
                    {greeting}
                  </TextEffect>

                  {/* shimmering toggle button */}
                  <FadeIn delay={0.2}>
                    <button
                      type="button"
                      onClick={toggleLang}
                      className="inline-block cursor-pointer"
                    >
                      <TextEffect per="word" preset="scale" className="text-[1.5rem]">
                        {lang === "en" ? "🇮🇪" : "🇧🇷"}
                      </TextEffect>
                    </button>
                  </FadeIn>

                  <FadeInBlur delay={0.15}>
                    <p className="max-w-[600px] md:text-xl">
                      {D}
                    </p>
                  </FadeInBlur>
                </div>
                <FadeInBlur delay={0.1}>
                  <Avatar
                    className="size-28"
                    style={{
                      boxShadow: '0 0 0 3px hsl(var(--theme-primary) / 0.3)',
                      border: '2px solid hsl(var(--theme-border))'
                    }}
                  >
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                    <AvatarFallback>{DATA.initials}</AvatarFallback>
                  </Avatar>
                </FadeInBlur>
              </div>
            </div>
          </section>
          <section id="about">
            <InView preset="fadeUp">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
              >
                {lang === "en" ? "About" : "Sobre"}
              </h2>
            </InView>
            <InView preset="fade" delay={0.1}>
              <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                {S}
              </Markdown>
            </InView>
          </section>
          <section id="work">
            <div className="flex min-h-0 flex-col gap-y-3">
              <InView preset="fadeUp">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                >
                  {lang === "en" ? "Work Experience" : "Experiência Profissional"}
                </h2>
              </InView>
              <AnimatedGroup preset="fadeUp" stagger={0.08}>
                {DATA.work.map((work, id) => (
                  <ResumeCard
                    key={work.company}
                    logoUrl={work.logoUrl}
                    altText={work.company}
                    title={work.company}
                    subtitle={work.title}
                    href={work.href}
                    badges={work.badges}
                    period={`${work.start} - ${work.end ?? "Present"}`}
                    description={
                      lang === "en"
                        ? work.description
                        : pt.work[id]
                    }
                  />
                ))}
              </AnimatedGroup>
            </div>
          </section>
          <section id="education">
            <div className="flex min-h-0 flex-col gap-y-3">
              <InView preset="fadeUp">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                >
                  {lang === "en" ? "Education" : "Educação"}
                </h2>
              </InView>
              <AnimatedGroup preset="fadeUp" stagger={0.1}>
                {DATA.education.map((education) => (
                  <ResumeCard
                    key={education.school}
                    href={education.href}
                    logoUrl={education.logoUrl}
                    altText={education.school}
                    title={education.school}
                    subtitle={education.degree}
                    period={`${education.start} - ${education.end}`}
                  />
                ))}
              </AnimatedGroup>
            </div>
          </section>
          <section id="skills">
            <div className="flex min-h-0 flex-col gap-y-3">
              <InView preset="fadeUp">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                >
                  {lang === "en" ? "Skills" : "Habilidades"}
                </h2>
              </InView>
              <AnimatedGroup as="div" asChild="span" preset="scale" stagger={0.02} className="flex flex-wrap gap-1">
                {DATA.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </AnimatedGroup>
            </div>
          </section>
          <section id="projects">
            <div className="space-y-12 w-full py-12">
              <InView preset="fadeUp">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <span className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                      {lang === "en" ? "My Projects" : "Meus Projetos"}
                    </span>
                    <TextEffect
                      per="word"
                      preset="blur"
                      as="h2"
                      className="text-3xl font-bold tracking-tighter sm:text-5xl"
                      style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                    >
                      {lang === "en" ? "Check out my latest work" : "Confira meu trabalho mais recente"}
                    </TextEffect>
                    <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      {lang === "en" ? "I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites." : "Trabalhei em diversos projetos, de sites simples a aplicações web complexas. Aqui estão alguns dos meus favoritos."}
                    </p>
                  </div>
                </div>
              </InView>
              <AnimatedGroup preset="blurSlide" stagger={0.1} className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                {DATA.projects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    title={project.title}
                    href={project.href}
                    description={project.description}
                    dates={project.dates}
                    tags={project.technologies}
                  />
                ))}
              </AnimatedGroup>
            </div>
          </section>
          <section id="hackathons">
            <div className="space-y-12 w-full py-12">
              <InView preset="fadeUp">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <span className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                      {lang === "en" ? "Hackathons" : "Hackatons"}
                    </span>
                    <TextEffect
                      per="word"
                      preset="blur"
                      as="h2"
                      className="text-3xl font-bold tracking-tighter sm:text-5xl"
                      style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                    >
                      {lang === "en" ? "I like building things" : "Eu gosto de criar coisas"}
                    </TextEffect>
                    <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      {lang === "en" ? DATA.hackathons[0].description : pt.hackathon}
                    </p>
                  </div>
                </div>
              </InView>
              <InView preset="fade">
                <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                  <AnimatedGroup as="div" asChild="li" preset="slideRight" stagger={0.08}>
                    {DATA.hackathons.map((project) => (
                      <HackathonCard
                        key={project.title + project.dates}
                        title={project.title}
                        description={project.description}
                        location={project.location}
                        dates={project.dates}
                        image={project.image}
                        links={project.links}
                      />
                    ))}
                  </AnimatedGroup>
                </ul>
              </InView>
            </div>
          </section>
          <section id="contact">
            <InView preset="blurSlide">
              <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                  <div className="space-y-3">
                    <span className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                      {lang === "en" ? "Contact" : "Contato"}
                    </span>
                    <TextEffect
                      per="word"
                      preset="blur"
                      as="h2"
                      className="text-3xl font-bold tracking-tighter sm:text-5xl"
                      style={{ fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))' }}
                    >
                      {lang === "en" ? "Get in Touch" : "Entre em Contato"}
                    </TextEffect>
                  </div>
                  <div className="w-full max-w-sm">
                    <ResumeContactCard lang={lang} />
                  </div>
                </div>
              </div>
            </InView>
          </section>

          <section id="cursor-stats">
            <InView preset="fadeUp">
              <div className="w-full py-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-full max-w-xl">
                    <CursorStatsCard lang={lang} />
                  </div>
                </div>
              </div>
            </InView>
          </section>
        </motion.main>
      </AnimatePresence>
    </div>
    </PageTransition>
  );
}
