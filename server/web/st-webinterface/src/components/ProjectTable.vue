<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle">
                    <table class="min-w-full divide-y divide-gray-300">
                        <caption class="hidden">Project Table</caption>
                        <thead>
                            <tr>
                                <th scope="col"
                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                    Name</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    description</th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="project in projects" :key="project.id" @click="navigateToProject(project.id)" class="cursor-pointer hover:bg-gray-100">
                                <td
                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                    {{ project.name }}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ project.description }}</td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">#{{ project.id }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { useRouter } from 'vue-router';

export default {
    name: 'ProjectTable',
    props: {
        projects: Array
    },
    setup() {
        const router = useRouter();

        const navigateToProject = (projectId) => {
            router.push(`/dashboard/projects/${projectId}`);
        };

        return { navigateToProject };
    }
};
</script>
  