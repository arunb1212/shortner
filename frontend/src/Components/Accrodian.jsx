import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion"

const Accrodian = () => {
  return (
    <div className='w-full max-w-3xl mt-16 px-4 animate-slide-up'>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-muted-foreground mt-2">
          Everything you need to know about our modern link shortener.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-premium">
        <Accordion type="single" collapsible className="space-y-1">
          <AccordionItem value="item-1" className="border-b border-zinc-100 py-1">
            <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:text-zinc-600 hover:no-underline transition-all">
              How does the URL shortener work?
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-zinc-500 pt-1 pb-4">
              When you enter a long URL, our system generates a unique, condensed short code. Clicking the short link redirects visitors to the original destination instantly while logging click analytics in real-time.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b border-zinc-100 py-1">
            <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:text-zinc-600 hover:no-underline transition-all">
              Can I customize the shortened URL alias?
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-zinc-500 pt-1 pb-4">
              Absolutely! Once registered and signed in, you can enter a custom text alias (e.g. "my-brand-link") instead of an auto-generated random code. Custom aliases build brand trust and readability.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b border-zinc-100 py-1">
            <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:text-zinc-600 hover:no-underline transition-all">
              What analytics can I track?
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-zinc-500 pt-1 pb-4">
              Our dashboard provides robust statistics including total click counts, exact creation timestamps, and interactive historical trends (using click activity logs) to help monitor your audience reach.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-0 py-1">
            <AccordionTrigger className="text-sm font-bold text-zinc-900 hover:text-zinc-600 hover:no-underline transition-all">
              Is QR Code generation included?
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-zinc-500 pt-1 pb-4">
              Yes, a high-quality QR code is automatically generated for every shortened URL. You can test the QR scan directly on the web or download it as a PNG asset to use on physical print materials or presentations.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default Accrodian