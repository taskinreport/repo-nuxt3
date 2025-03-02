<template>
  <footer class="bg-gray-100 mt-auto py-12">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        <!-- Şirket Bilgileri -->
        <div>
          <h3 class="font-bold text-lg mb-4">
            {{ $t("footer.company.title") }}
          </h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">
                {{ $t("footer.company.about") }}
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">
                {{ $t("footer.company.careers") }}
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">
                {{ $t("footer.company.contact") }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Hizmetler -->
        <div>
          <h3 class="font-bold text-lg mb-4">
            {{ $t("footer.services.title") }}
          </h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.services.web")
              }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.services.mobile")
              }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.services.consulting")
              }}</a>
            </li>
          </ul>
        </div>

        <!-- Destek -->
        <div>
          <h3 class="font-bold text-lg mb-4">
            {{ $t("footer.support.title") }}
          </h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.support.faq")
              }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.support.docs")
              }}</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-500">{{
                $t("footer.support.help")
              }}</a>
            </li>
          </ul>
        </div>

        <!-- İletişim -->
        <div>
          <h3 class="font-bold text-lg mb-4">
            {{ $t("footer.contact.title") }}
          </h3>
          <ul class="space-y-2">
            <li class="text-gray-600">{{ $t("footer.contact.address") }}</li>
            <li class="text-gray-600">{{ $t("footer.contact.phone") }}</li>
            <li class="text-gray-600">{{ $t("footer.contact.email") }}</li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
        <p>{{ $t("footer.copyright") }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Global i18n kullanılıyor
</script>
