import { type ILanguageExample } from "./interfaces";

export const examples: ILanguageExample[] = [
	{
		title: "Hello world",
		content: `pub main -> int [
	say "Hello, World!".
	give 0.		
]`,
	},
	{
		title: "CLI Arguments",
		content: `pub main -> int
(args :: slice![cStr]) [
	loop in args => let item, i [
      say "Argument at ", i,
	      " is: ", item.
   ]
   give 0.
]
 `,
	},
];

export const languageFeatures = [
	{
		title: "Skill methods & Polymorphs",
		content:
			"Skills enable behavioural polymorphism in the language so that various types can share behaviour without being involved in each others' implementation. Polymorphs are objects that store information about the behaviour of a type that enables you to invoke behaviour of the data without knowing the underlying type.",
	},
	{
		title: "Mix types / Sum types",
		content: `What if you want to represent multiple possibilities of types as a single type? In qat, \`mix\` types expose the functionality of runtime polymorphism on the type level. You can mix multiple datatypes into a single type, safely, without losing information about the underlying type.`,
	},
	{
		title: "Marks / Pointers",
		content: `Marks/Pointers in qat introduces the concept of ownership, optionally. This allows you to keep track of the origin of the memory at compile time (zero cost), and also introduces several safe pointer types in the language. The design of the language has given priority to a multitude of memory management strategies.`,
	},
	{
		title: "No garbage collection. No borrow checking",
		content:
			"There is no garbage collection happening when a program written in qat is running. So there is nothing from the language runtime that drags down the performance of your program. There is also no borrow checking to drag down the programmer during development and force them to circumvent the semantics of the language to get productivity. Such concepts come off as philosophical, but ends up being pretentious and over complicated, introducing guardrails even in situations that cannot benefit from them.",
	},
	{
		title: "Customisable Lifetimes",
		content: `Use constructors, destructors, copy & move semantics and the type system to your advantage to manage resources efficiently. You have complete control over the lifetimes of the objects in your program logic.`,
	},
	{
		title: "Pattern Matching",
		content: `This makes the rich type system much more useful and provides novel ways to analyse and manipulate data in the language. There is also a novel way of inline pattern matching, that replaces the classic ternary operator, and provides a simple syntax for simple logic.`,
	},
	{
		title: "Extensive Compile Time Execution",
		content:
			"Prerun expressions in qat are expressions that are calculated at compile-time. Unlike other languages that support compile-time execution, in qat, this is taken to the next level. You can use these expressions to change the behaviour of the code according to the platform, customize the build process, bind to external libraries programmatically, do advanced metaprogramming, statically analyse conditions, and much more...",
	},
	{
		title: "Generic Types",
		content:
			"Struct types and type definitions in qat can be generic. Both types and prerun expressions can be used to instantiate variants of such a generic type. The power of prerun expressions takes generic types to a new level and makes it way more modular and powerful.",
	},
	{
		title: "Mutable Value Semantics",
		content:
			"You can use and manage objects whose lifetime is not bound to an address if your type is trivially copyable & trivially movable. You can access member fields of the value directly from (virtual) registers. You can do something similar in other languages as well because of niche optimisations, but in qat, the member fields can be extracted directly from the value without allocating it first.",
	},
	{
		title: "Copy & Move semantics",
		content:
			"qat provides copy & move semantics to enable the programmer to transfer ownership of data between contexts. This feature has a distinction in qat - if the type in question is not trivially copyable or trivially movable, copy or move has to be done manually by the programmer. This is to make sure that the programmer is aware of the transfer of ownership of data in the codebase.",
	},
];
