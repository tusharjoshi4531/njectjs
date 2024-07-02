import { contextRegistry } from "../core/context_registry";
import { Component } from "../decorators/component_decorator";
import { IOCContext } from "../decorators/context_decorator";

@IOCContext()
class Contenxt {}

@IOCContext("named_cont")
class NamedContext {}

@Component()
class A {}

@Component()
class C {}

@Component("named_cont")
class B {}

@Component("named_cont")
class BC {}



console.log(contextRegistry.getRegisteredContextIds());
console.log(contextRegistry.getDefaultContext().getConstructorIDs());
console.log(contextRegistry.getContextById("named_cont").getConstructorIDs());

contextRegistry.getDefaultContext().build();
contextRegistry.getContextById("named_cont").build();

console.log(contextRegistry.getDefaultContext().getObjectIds());
console.log(contextRegistry.getContextById("named_cont").getObjectIds());
