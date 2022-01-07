package com.b2b.quote;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.b2b.quote");

        noClasses()
            .that()
            .resideInAnyPackage("com.b2b.quote.service..")
            .or()
            .resideInAnyPackage("com.b2b.quote.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.b2b.quote.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
